<script>
  import { values } from "../stores/simulation";
  import { clock } from "../stores/utils";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary();

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

  $: cipc_data = toPoints($values.derived.cipc_graph, -5.06666, 76);

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
    <div class="main-label">{dict['CI']}</div>
    <div class="min">0.00</div>
    <div class="mid">7.50</div>
    <div class="max">15.00</div>
    <div class="bottom-left">-24h</div>
    <div class="bottom-right">{$clock}</div>
  </div>
  <svg viewBox="0 0 76 76" class="plot">
    <path d={cipc_data} stroke="#f7931e" stroke-width="1" fill="none" />
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
    left: calc(50% - 30px);
  }
  .plot {
    position: absolute;
    top: calc(50% - 40px);
    left: calc(50% - 30px);
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
  .main-label {
    position: absolute;
    top: -14px;
    left: -10px;
    color: orange;
  }
  .min {
    position: absolute;
    color: orange;
    right: 80px;
    bottom: 0;
  }
  .max {
    position: absolute;
    color: orange;
    right: 80px;
    top: 0;
  }
  .mid {
    position: absolute;
    color: orange;
    right: 80px;
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
