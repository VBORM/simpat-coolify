import io from "socket.io-client";
import { Target, values, signal_values, computeTdResult } from "./simulation";

const format = (input) => {
  return typeof input === "string" && /^[\.\d]+$/.test(input)
    ? Number(input)
    : input;
};

const getSearchParams = () => {
  return new URLSearchParams(window.location.search);
};

const getRoomId = () => {
  return getSearchParams().get("room") || "";
};

const getSnapshotSignal = () => {
  const snapshot = getSearchParams().get("snapshot");

  if (!snapshot) {
    return null;
  }

  try {
    return JSON.parse(snapshot);
  } catch (error) {
    console.warn("invalid-snapshot", error);
    return null;
  }
};

const getSignalCacheKey = (roomId) => {
  return `simpat.signal.${roomId}`;
};

const readCachedSignal = (roomId) => {
  if (!roomId) {
    return null;
  }

  try {
    const rawSignal = window.sessionStorage.getItem(getSignalCacheKey(roomId));
    return rawSignal ? JSON.parse(rawSignal) : null;
  } catch (error) {
    console.warn("failed-to-read-signal-cache", error);
    return null;
  }
};

const writeCachedSignal = (roomId, signal) => {
  if (!roomId) {
    return;
  }

  try {
    window.sessionStorage.setItem(getSignalCacheKey(roomId), JSON.stringify(signal));
  } catch (error) {
    console.warn("failed-to-write-signal-cache", error);
  }
};

const MIN_PATIENT_AGE = 1;
const MAX_PATIENT_AGE = 105;
const IMMEDIATE_SIGNAL_KEYS = [
  "firstname",
  "surname",
  "weight",
  "height",
  "hrCurve",
  "tdCurve",
  "papCurve",
  "tInj",
  "sendCO",
  "gender",
  "age",
  "age_group",
  "vent_control",
];

const clampPatientAge = (age) => {
  return Math.min(MAX_PATIENT_AGE, Math.max(MIN_PATIENT_AGE, age));
};

const getAgeFromDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) {
    return null;
  }

  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return clampPatientAge(age);
};

const normalizeSignal = (signal) => {
  const normalizedSignal = {};

  for (let key in signal) {
    normalizedSignal[key] = format(signal[key]);
  }

  const explicitAge = Number(
    normalizedSignal.age ??
      normalizedSignal.patientAge ??
      normalizedSignal.patient_age ??
      normalizedSignal.patientage
  );

  if (Number.isFinite(explicitAge)) {
    normalizedSignal.age = clampPatientAge(Math.round(explicitAge));
  } else {
    const derivedAge = getAgeFromDateOfBirth(normalizedSignal.dateOfBirth);

    if (derivedAge != null) {
      normalizedSignal.age = derivedAge;
    }
  }

  if (normalizedSignal.age != null) {
    normalizedSignal.patientAge = normalizedSignal.age;
  }

  delete normalizedSignal.patient_age;
  delete normalizedSignal.patientage;

  return normalizedSignal;
};

let socket = null;

const applySignal = (roomId, signal) => {
  const normalizedSignal = normalizeSignal(signal);

  if (Object.keys(normalizedSignal).length === 0) {
    return;
  }

  const immediateSignalValues = {};

  for (const key of IMMEDIATE_SIGNAL_KEYS) {
    if (key in normalizedSignal) {
      immediateSignalValues[key] = normalizedSignal[key];
    }
  }

  if (typeof normalizedSignal.hr === "number" && Number.isFinite(normalizedSignal.hr)) {
    immediateSignalValues.waveformHr = normalizedSignal.hr;
  }

  writeCachedSignal(roomId, normalizedSignal);

  signal_values.update((previous) => ({
    ...previous,
    ...normalizedSignal,
  }));

  for (let key in normalizedSignal) {
    Target[key] = normalizedSignal[key];
  }

  values.update((previous) => {
    Target.ramp = !previous.dirty ? 1 : Target.ramp;

    return {
      ...previous,
      ...immediateSignalValues,
      ramp: 0,
      td_available: true,
      dirty: true,
    };
  });
};

const requestRecentSignal = (roomId) => {
  if (socket && roomId) {
    socket.emit("recent signal", roomId);
  }
};

const subscribeToRoom = () => {
  const roomId = getRoomId();
  const snapshotSignal = getSnapshotSignal();
  const cachedSignal = readCachedSignal(roomId);

  if (snapshotSignal) {
    applySignal(roomId, snapshotSignal);
  } else if (cachedSignal) {
    applySignal(roomId, cachedSignal);
  }

  socket = io();
  socket.on(`simulation signal ${roomId}`, (signal) => applySignal(roomId, signal));
  socket.on("connect", () => requestRecentSignal(roomId));

  if (socket.connected) {
    requestRecentSignal(roomId);
  }
};

export { subscribeToRoom };
