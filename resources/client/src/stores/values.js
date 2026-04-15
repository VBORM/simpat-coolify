import { get, writable } from "svelte/store";

const formatData = (values) => {
  let formatted = {};
  for (let k in values) {
    if (typeof values[k] === "boolean") {
      formatted[k] = values[k];
    } else if (values[k]) {
      if (/^[\d\.]+$/.test(values[k])) {
        formatted[k] = Number(values[k]);
      } else {
        formatted[k] = values[k];
      }
    } else {
      formatted[k] = 0;
    }
  }
  return formatted;
};

const getHoursAndMinutes = () => {
  let time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  return `${hours}:${minutes}`;
};

const td_values = writable({
  dirty: false,
  cipc: 0,
  min_cipc: 0,
  max_cipc: 0,
  td_cipc: 0,
  gedi: 0,
  cpi: 0,
  gef: 0,
  elwi: 0,
  pvpi: 0,
  svv: 0,
  cfi: 0,
  t_inj: 0,
  delta_t: 0,
  td_time: 0,
  svri: 0,
});

const values = writable({
  td_available: false,
  td_open: false,
  dirty: false,
  ramp: 0,
  sendCO: false,
  time: "",
  weight: 0,
  height: 0,
  firstname: "",
  surname: "",

  sap: 0,
  min_sap: 0,
  max_sap: 0,
  map: 0,
  dap: 0,
  hr: 0,
  min_hr: 0,
  max_hr: 0,
  cvp: 0,
  bsa: 0,
  svi: 0,
  cipc: 0,
  min_cipc: 0,
  max_cipc: 0,
  cipc_graph: [],
  ppv: 0,
  co: 0,
  svri: 0,
  svri_graph: [],
  gedi: 0,
  gef: 0,
  elwi: 0,
  pvpi: 0,
  tb: 0,
  svv: 0,
  svv_graph: [],
  cfi: 0,
  td_cipc: 0,
  scvo: 0,
  min_scvo: 0,
  max_scvo: 0,
  cpi: 0,
  delta_t: 0,
  t_inj: 0,
  hrCurve: "",
  tdCurve: "",
  time_since_td: { h: "**", min: "**" }, //dependent on td_data.
});

let Target = Object.assign({}, values);

const trim = (value, digits) => {
  return Number(value.toFixed(digits || 0));
};

function update_delta() {
  //calculate Time scince last TD
  let min = "**";
  let h = "**";
  const td_time = get(td_values).td_time;
  if (td_time != 0) {
    let delta = Math.abs(Date.now() - td_time) / 1000;
    h = Math.floor(delta / 3600) % 24;
    delta -= h * 3600;
    min = Math.floor(delta / 60) % 60;
  }
  return { h: h, min: min };
}

const processNextTick = () => {
  values.update((previous) => {
    let updated = { ...previous };
    updated.time = getHoursAndMinutes();
    updated.firstname = Target.firstname;
    updated.surname = Target.surname;
    updated.weight = Target.weight;
    updated.height = Target.height;
    updated.hrCurve = Target.hrCurve;
    updated.tdCurve = Target.tdCurve;

    if (updated.ramp < Target.ramp) {
      let dt = Target.ramp - updated.ramp;
      updated.sap += (Target.sap - updated.sap) / dt;
      updated.dap += (Target.dap - updated.dap) / dt;
      updated.map = updated.dap + (updated.sap - updated.dap) / 3;
      updated.hr += (Target.hr - updated.hr) / dt;
      updated.cvp += (Target.cvp - updated.cvp) / dt;
      let bsa = Math.sqrt((Target.weight * Target.height) / 3600);
      updated.svi += (Target.svi - updated.svi) / dt;
      updated.cipc = (updated.svi * updated.hr) / 1000;

      updated.ppv += (Target.ppv - updated.ppv) / dt;
      updated.svri = ((updated.map - updated.cvp) / updated.cipc) * 80;
      updated.gedi += (Target.gedi - updated.gedi) / dt;
      updated.gef = ((4 * (updated.svi * bsa)) / (updated.gedi * bsa)) * 100;
      updated.elwi += (Target.elwi - updated.elwi) / dt;
      updated.pvpi += (Target.pvpi - updated.pvpi) / dt;
      updated.tb += (Target.tb - updated.tb) / dt;

      updated.svv += (Target.svv - updated.svv) / dt;

      updated.cfi = (updated.svi * updated.hr) / updated.gedi;
      updated.td_cipc = updated.cipc;
      updated.scvo += (Target.scvo - updated.scvo) / dt;
      updated.cpi = updated.map * updated.cipc * 0.0022;

      updated.min_sap = Math.min(updated.sap, updated.min_sap);
      updated.max_sap = Math.max(updated.sap, updated.max_sap);
      updated.min_hr = Math.min(updated.hr, updated.min_hr);
      updated.max_hr = Math.max(updated.hr, updated.max_hr);
      updated.min_cipc = Math.min(updated.cipc, updated.min_cipc);
      updated.max_cipc = Math.max(updated.cipc, updated.max_cipc);
      updated.min_scvo = Math.min(updated.scvo, updated.min_scvo);
      updated.max_scvo = Math.max(updated.scvo, updated.max_scvo);
      updated.ramp++;
    }

    updated.t_inj = Target.tInj;
    updated.delta_t = Target.deltaT;

    if (updated.svv_graph.length === 300) {
      updated.svv_graph = updated.svv_graph.slice(1);
    }
    updated.svv_graph.push(updated.svv);

    if (updated.cipc_graph.length === 300) {
      updated.cipc_graph = updated.cipc_graph.slice(1);
    }
    updated.cipc_graph.push(updated.cipc);

    if (updated.svri_graph.length === 300) {
      updated.svri_graph = updated.svri_graph.slice(1);
    }
    updated.svri_graph.push(updated.svri);

    updated.time_since_td = update_delta();

    return updated;
  });
};

const updateTDValues = () => {
  td_values.update((previous) => {
    let updated = { ...previous };
    updated.dirty = true;
    updated.td_cipc = (Target.svi * Target.hr) / 1000;
    updated.gedi = Target.gedi;
    let bsa = Math.sqrt((Target.weight * Target.height) / 3600);
    updated.gef = ((4 * (Target.svi * bsa)) / (Target.gedi * bsa)) * 100;
    updated.elwi = Target.elwi;
    updated.pvpi = Target.pvpi;
    updated.svri =
      ((Target.dap + (Target.sap - Target.dap) / 3 - Target.cvp) /
        updated.td_cipc) *
      80;
    updated.svv = Target.svv;
    updated.cfi = (Target.svi * Target.hr) / Target.gedi;
    updated.t_inj = Target.tInj;
    updated.delta_t = Target.deltaT;
    updated.td_time = Date.now();
    return updated;
  });
};

import io from "socket.io-client";
let socket = null;
const subscribeToRoom = () => {
  socket = io();
  let searchParams = new URLSearchParams(window.location.search);
  let room = searchParams.get("room");
  socket.on(`simulation signal ${room}`, (data) => {
    values.update((previous) => {
      // if (previous.td_open) return previous;
      Target = formatData(data);
      if (!previous.dirty) {
        Target.ramp = 1;
      }
      return {
        ...previous,
        ramp: 0,
        td_available: true,
        // td_open: false, Note: commented so the td_open state is kept
        dirty: true,
      };
    });
  });
  socket.emit("recent signal", room);
};

export { subscribeToRoom, processNextTick, updateTDValues, values, td_values };
