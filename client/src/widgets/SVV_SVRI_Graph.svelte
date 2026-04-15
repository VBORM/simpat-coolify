<script>
  import { values } from "../stores/simulation";
  import { clock } from "../stores/utils";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary()

  const toPoints = (points, scale, displace) => {
    let num = points.length;
    let arr = new Array(num).fill(0);
    for (let i = 0; i < num; i++) {
      let val = points[i] === Infinity || points[i] === -Infinity ? 0 : points[i];
      let x = (300 - num + i) * 0.253333;
      let y = val * scale + displace;
      if (i === 0) {
        arr[i] = `M${x} ${y}`;
      } else {
        arr[i] = `L${x} ${y}`;
      }
    }
    return arr.join("");
  };

  $: svv_data = toPoints($values.derived.svv_graph, -3.8, 76);
  $: svri_data = toPoints($values.derived.svri_graph, -0.0152, 76);
  $: time_hh_mm = '00:00';

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true;
    } else {
      alert("App has not received a simulation signal yet.");
    }
  };
</script>

<div class="wrapper" on:click={handleOpenTD}>
  <div class="box">
    <div class="shade" />
    <div class="split" />
    <div class="main-label-left">{dict['SVV']}</div>
    <div class="main-label-right">{dict['SVRI']}</div>
    <!-- <div class="min">0.00</div> -->
    <div class="mid">5</div>
    <div class="max">20</div>
    <div class="min-right">1000</div>
    <div class="mid-right">3000</div>
    <div class="max-right">5000</div>
    <div class="bottom-left">-24h</div>
    <div class="bottom-right">{$clock}</div>
  </div>
  <svg viewBox="0 0 76 76" class="plot">
    <path d={svv_data} stroke="#00778e" stroke-width="1" fill="none" />
    <path d={svri_data} stroke="#a0a0a0" stroke-width="1" fill="none" />
  </svg>
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 10px;
  }

  .box {
    position: absolute;
    width: 76px;
    height: 76px;
    border: 1px solid #606060;
    border-top-style: dashed;
    border-bottom-style: dashed;
    top: calc(50% - 40px);
    left: calc(50% - 44px);
  }
  .plot {
    position: absolute;
    top: calc(50% - 40px);
    left: calc(50% - 44px);
    width: 76px;
    height: 76px;
  }
  .shade {
    background-color: #202020;
    height: 30px;
    position: absolute;
    top: calc(50% - 15px);
    left: 1px;
    right: 1px;
  }
  .split {
    position: absolute;
    border-top: 1px dashed #606060;
    top: 50%;
    left: 0;
    right: 0;
  }
  .main-label-left {
    position: absolute;
    top: -14px;
    left: -10px;
    color: #00778e;
  }
  .main-label-right {
    position: absolute;
    top: -14px;
    right: 0;
    color: #a0a0a0;
  }
  .max {
    position: absolute;
    color: #00778e;
    right: 80px;
    top: 0;
  }
  .mid {
    position: absolute;
    color: #00778e;
    right: 80px;
    top: 30px;
  }
  .min-right {
    position: absolute;
    color: #a0a0a0;
    right: -24px;
    bottom: 0;
  }
  .max-right {
    position: absolute;
    color: #a0a0a0;
    right: -24px;
    top: 0;
  }
  .mid-right {
    position: absolute;
    color: #a0a0a0;
    right: -24px;
    top: 30px;
  }
  .bottom-left {
    position: absolute;
    color: #a0a0a0;
    bottom: -14px;
    left: 0;
  }
  .bottom-right {
    position: absolute;
    color: #a0a0a0;
    right: 0;
    bottom: -14px;
  }
</style>
