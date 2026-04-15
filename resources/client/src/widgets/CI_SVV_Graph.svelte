<script>
  import { values } from "../stores/simulation";
  import { clock } from "../stores/utils";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary()

  const toPoints = (points, scale, displace) => {
    let num = points.length;
    let arr = new Array(num).fill(0);
    for (let i = 0; i < num; i++) {
      let x = (300 - num + i) * 1.266;
      let y = points[i] * scale + displace;
      if (i === 0) {
        arr[i] = `M${x} ${y}`;
      } else {
        arr[i] = `L${x} ${y}`;
      }
    }
    return arr.join("");
  };

  $: svv_data = toPoints($values.derived.svv_graph, -7.4, 148);
  $: cipc_data = toPoints($values.derived.cipc_graph, -14.33333, 215);
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
  <svg viewBox="0 0 380 215" class="frame">
    <line
      x1="0"
      y1="0"
      x2="380"
      y2="0"
      stroke="#606060"
      stroke-width="1"
      stroke-dasharray="5 5"
    />
    <line
      x1="0"
      y1="215"
      x2="380"
      y2="215"
      stroke="#606060"
      stroke-width="1"
      stroke-dasharray="5 5"
    />
    <line x1="0" y1="0" x2="0" y2="215" stroke="#606060" stroke-width="1" />
    <line x1="380" y1="0" x2="380" y2="215" stroke="#606060" stroke-width="1" />
    <rect width="378" x="1" y="68" height="80" fill="#202020" />
    <line
      x1="0"
      y1="108"
      x2="380"
      y2="107"
      stroke="#606060"
      stroke-width="1"
      stroke-dasharray="3 2"
    />
    <path d={svv_data} stroke="#00778e" stroke-width="1" fill="none" />
    <path d={cipc_data} stroke="#f7931e" stroke-width="1" fill="none" />
    <line x1="125" y1="0" x2="125" y2="215" stroke="#606060" stroke-width="1" />
    <line x1="253" y1="0" x2="253" y2="215" stroke="#606060" stroke-width="1" />
  </svg>
  <div class="box">
    <div class="time" style="left: -2%">-30 min</div>
    <div class="time" style="left: 30%">-20 min</div>
    <div class="time" style="left: 62%">-10 min</div>
    <!-- Fix this 00:00 -->
    <div class="time" style="right: 0">{$clock}</div>
    <div class="orange" style="top:-15px">{dict['CI']}</div>
    <div class="orange" style="top:0">15.0</div>
    <div class="orange" style="top:29%">10.3</div>
    <div class="orange" style="top:47%">8.00</div>
    <div class="orange" style="top:66%">5.66</div>
    <div class="orange" style="top:94%">1.0</div>
    <div class="cyan" style="top: -15px">{dict['SVV']}</div>
    <div class="cyan" style="top: 0">20</div>
    <div class="cyan" style="top: 29%">10</div>
    <div class="cyan" style="top: 47%">5</div>
    <div class="cyan" style="top: 66%">0</div>
  </div>
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

  .box,
  .frame {
    position: absolute;
    width: 380px;
    height: 215px;
    top: calc(50% - 108px);
    left: calc(50% - 190px);
  }
  .time {
    position: absolute;
    bottom: -12px;
    color: #a0a0a0;
    font-size: 10px;
  }
  .orange {
    position: absolute;
    right: calc(100% + 2px);
    font-size: 11px;
    color: #f7931e;
  }
  .cyan {
    position: absolute;
    color: #00778e;
    left: calc(100% + 2px);
    font-size: 11px;
  }
</style>
