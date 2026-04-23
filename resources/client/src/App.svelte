<script>
  import { values, computeNextTick } from "./stores/simulation";
  import { clock } from "./stores/utils";
  import { subscribeToRoom } from "./stores/socket";
  import { onMount } from "svelte";
  import Screen1 from "./components/Screen1.svelte";
  import Screen2 from "./components/Screen2.svelte";
  import Screen3 from "./components/Screen3.svelte";
  import Screen4 from "./components/Screen4.svelte";
  import Screen5 from "./components/Screen5.svelte";
  import Screen6 from "./components/Screen6.svelte";
  import Screen7 from "./components/Screen7.svelte";
  import Screen8 from "./components/Screen8.svelte";
  import Screen9 from "./components/Screen9.svelte";
  import Screen10 from "./components/Screen10.svelte";
  import Screen11 from "./components/Screen11.svelte";
  import Screen12 from "./components/Screen12.svelte";
  import Screen13 from "./components/Screen13.svelte";
  import Screen14 from "./components/Screen14.svelte";
  import Screen15 from "./components/Screen15.svelte";
  import Screen16 from "./components/Screen16.svelte";
  import Screen17 from "./components/Screen17.svelte";
  import ScreenPicker from "./components/ScreenPicker.svelte";
  import TD_Measurement from "./components/TD_Measurement.svelte";
  import { getDictionary } from "./stores/locale";
  
  const dict = getDictionary();

  let screenPicker = false;
  let activeScreen = "10";
  let scaleFactor = 1;
  const SIMULATION_CLIENT_VERSION = "3.1.9-release-1";

  console.info("[SimPaT Viewer]", SIMULATION_CLIENT_VERSION);

  const formatPatientAge = (age) => {
    if (age == null || age === "") {
      return "";
    }

    const numericAge = Number(age);
    if (!Number.isFinite(numericAge)) {
      return "";
    }

    return `${Math.round(numericAge)} yrs`;
  };

  const formatPatientGender = (gender) => {
    if (gender == null || gender === "") {
      return "";
    }

    const normalizedGender = String(gender).trim().toUpperCase();

    if (normalizedGender === "M") {
      return dict.MALE || "Male";
    }

    if (normalizedGender === "F") {
      return dict.FEMALE || "Female";
    }

    if (dict[normalizedGender]) {
      return dict[normalizedGender];
    }

    if (normalizedGender === "MALE") {
      return "Male";
    }

    if (normalizedGender === "FEMALE") {
      return "Female";
    }

    return String(gender).trim();
  };

  const getPatientAgeValue = (valuesStore) => {
    return valuesStore.age ?? valuesStore.patientAge ?? valuesStore.patient_age ?? valuesStore.patientage ?? null;
  };

  const formatPatientGenderAge = (gender, age) => {
    return [formatPatientGender(gender), formatPatientAge(age)]
      .filter((value) => value !== "")
      .join(" ");
  };

  const openScreenPicker = () => {
    screenPicker = true;
  };
  const closeScreenPicker = () => {
    screenPicker = false;
  };
  const navigateToScreen = (event) => {
    activeScreen = event.detail.screen;
    screenPicker = false;
  };

  const Screens = {
    1: Screen1,
    2: Screen2,
    3: Screen3,
    4: Screen4,
    5: Screen5,
    6: Screen6,
    7: Screen7,
    8: Screen8,
    9: Screen9,
    10: Screen10,
    11: Screen11,
    12: Screen12,
    13: Screen13,
    14: Screen14,
    15: Screen15,
    16: Screen16,
    17: Screen17,
  };

  onMount(() => {
    subscribeToRoom();
    setInterval(computeNextTick, 1000);
  });

  const handleFullscreen = () => {
    if (
      !document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  };
  const handleFullscreenChange = (event) => {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement
    ) {
      setTimeout(() => {
        scaleFactor = window.screen.height / 484;
      }, 100);
    } else {
      scaleFactor = 1;
    }
  };
</script>

<svelte:window on:fullscreenchange={handleFullscreenChange} />
<div class="frame" style="transform:scale({scaleFactor})" data-client-version={SIMULATION_CLIENT_VERSION}>
  <div class="preheader">
    <div class="fullscreen-btn" on:click={handleFullscreen}>FULLSCREEN</div>
    <img
      src="/assets/main_layout/lower_bar/screen_select_button.svg"
      class="screen-picker-btn cursor-pointer"
      on:click={openScreenPicker}
      alt=""
    />

    <span class="logotype">SimPaT</span>
  </div>
  <div class="header" data-client-version={SIMULATION_CLIENT_VERSION}>
    <img src="/assets/main_layout/top_bar/clock.svg" class="mr-15" alt="" />
    <div class="current-time">{$clock}</div>
    <div class="header-divider ml-60" />
    <img src="/assets/main_layout/top_bar/person_outline.svg" alt="" />
    <span class="ml-60 mr-15">{$values.height ?? '***'} cm</span>
    <span>{$values.weight ?? '***'} kg</span>
    <div class="header-divider" />
    <div class="gender-age">
      <span>{formatPatientGenderAge($values.gender, getPatientAgeValue($values))}</span>
    </div>
    <!-- <div class="header-divider ml-auto" />
    <img src="/assets/main_layout/top_bar/brightness.svg" alt="" />
    <div class="header-divider" />
    <img src="/assets/main_layout/top_bar/alarm.svg" alt="" /> -->
  </div>
  <div class="content">
    <svelte:component this={Screens[activeScreen]} />
  </div>
  {#if screenPicker}
  <ScreenPicker on:close={closeScreenPicker} on:select={navigateToScreen} />
  {/if}
  {#if $values.td_open}
  <TD_Measurement />
  {/if}
</div>

<style>
  .frame {
    width: 860px;
    height: 482px;
    background-color: #1f1b1e;
    color: white;
    margin: 16px auto 0 auto;
    border-radius: 5px;
    display: grid;
    grid-template-rows: 40px 36px 1fr;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
    transform-origin: top center;
  }

  :global(html:fullscreen) .frame {
    margin: 0 auto;
  }
  .preheader {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px;
  }
  .logotype {
    margin-left: auto;
    font-size: 20px;
    line-height: 48px;
  }
  .fullscreen-btn {
    cursor: pointer;
    user-select: none;
    opacity: 0.6;
    font-size: 11px;
    font-family: monospace;
    padding: 6px 8px;
    line-height: 11px;
    border: 1px solid white;
    border-radius: 4px;
  }
  .fullscreen-btn:hover {
    opacity: 1;
  }
  .screen-picker-btn {
    opacity: 0.75;
    width: 28px;
    margin-top: 1px;
  }
  .screen-picker-btn:hover {
    opacity: 1;
  }
  .header {
    background: linear-gradient(
      to bottom,
      #383838 0%,
      #181818 49%,
      #060606 50%
    );
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
  }
  .header-divider {
    border-right: 1px solid #a0a0a0;
    height: 30px;
    margin-left: 15px;
    margin-right: 15px;
  }
  .gender-age {
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
  }
  .content {
    background-color: #000000;
    position: relative;
    user-select: none;
  }
  .ml-60 {
    margin-left: 60px;
  }
  .mr-15 {
    margin-right: 15px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
