<script>
  import { values, td_values, computeTdResult, format } from '../stores/simulation'
  import TD_CurveAnimated from './TD_CurveAnimated.svelte'
  import { getDictionary } from '../stores/locale';

  const dict = getDictionary()

  let injecting = false
  let phase = ''
  let volume = '20'
  let curve = false
  let selectedTdCurve = ''

  $: cipc = $td_values.dirty ? format($td_values.td_cipc || 0, 2, '*.**') : '*.**'
  $: gedi = $td_values.dirty ? Math.round($td_values.gedi) : '**'
  $: elwi = $td_values.dirty ? Math.round($td_values.elwi) : '**'
  $: delta_t = $td_values.dirty ? format($td_values.delta_t || 0, 2, '*.**') : '*.**'
  $: v_inj = $td_values.dirty ? Math.round(volume || 0) : '**'
  $: t_inj = $td_values.dirty ? format($td_values.t_inj || 0, 1, '*.*') : '*.*'
  $: phase_text = phase.includes('?') ? dict[phase].replace('?', volume) : dict[phase] || phase;

  const timers = []

  const clearAllTimers = () => {
    while (timers.length) {
      clearTimeout(timers.pop())
    }
  }

  const CurveRevealTimers = {
    // '8-sec-normal-ci': 26096,
    // '15-sec-slow-low': 34288,
    // '18-sec-slow-very-low': 39942,
    // 'ci-left-right-shunt': 33827,
    // 'direct-detection': 35904,
    // 'noisy': 40000,
    // 'normal-td': 2500,
    // 'premature-hump': 39365,
  }

  const handleStartStop = () => {
    clearAllTimers()
    selectedTdCurve = $values.tdCurve
    if (injecting) {
      injecting = false
      curve = false
      phase = ''
    } else {
      phase = 'Wait...'
      curve = false
      injecting = true
      timers.push(
        setTimeout(() => {
          phase = `Inject ? ml`
        }, 4000)
      )
      timers.push(
        setTimeout(() => {
          phase = 'Injecting'
          curve = true
        }, 8000)
      )
      timers.push(
        setTimeout(() => {
          phase = ''
        }, 10000)
      )
      timers.push(
        setTimeout(() => {
          injecting = false
          computeTdResult()
        }, CurveRevealTimers[$values.tdCurve] || 14_000)
      )
    }
  }

  const handleCloseTD = () => {
    if (!injecting) {
      $values.td_open = false
    }
  }
</script>

<div class="backdrop">
  <div class="wrapper">
    <div class="header">
      <img src="/assets/td_modal/header_icon.svg" alt="header-icon" />
      <span> {dict['TD Measurement']} </span>
      <div class="dark-btn ml-auto" on:click={handleCloseTD}>✕</div>
    </div>
    <div class="inner-wrapper">
      <div class="controls">
        <div class="dark-btn large mr-auto" on:click={handleStartStop}>
          <img src="/assets/td_modal/start_btn_icon.svg" alt="header-icon" />
          <span>{injecting ? dict['Stop'] : dict['Start']}</span>
        </div>
        <span>{dict['Inj Vol.']}</span>
        <select name="volume" disabled={injecting} bind:value={volume} id="">
          <option value="2">2 ml</option>
          <option value="5">5 ml</option>
          <option value="10">10 ml</option>
          <option value="15">15 ml</option>
          <option value="20">20 ml</option>
        </select>
        <span>{dict['CVP']}.</span>
        <div class="disabled-select">
          {$values.cvp}
        </div>
        <!-- <select name="" values="5" id="">
          <option value="5">5</option>
        </select> -->
        <div class="dark-btn large" style="padding-right:60px">
          <img src="/assets/td_modal/settings_btn_icon.svg" alt="header-icon" />
          <span>{dict['Settings']}</span>
        </div>
      </div>
      <div class="content">
        <div class="content-wrapper">
          <!-- Start of graph -->
          <svg viewBox="0 0 580 210" width="580" height="210">
            <rect
              fill="transparent"
              stroke-width="0.5"
              stroke-dasharray="2 2"
              stroke="#404040"
              x="30"
              y="15"
              width="520"
              height="180"
            />
            <line
              x1="30"
              y1="75"
              x2="550"
              y2="75"
              fill="transparent"
              stroke-width="0.5"
              stroke-dasharray="2 2"
              stroke="#404040"
            />
            <line
              x1="30"
              y1="135"
              x2="550"
              y2="135"
              fill="transparent"
              stroke-width="0.5"
              stroke-dasharray="2 2"
              stroke="#404040"
            />
            <line
              x1="35%"
              y1="15"
              x2="35%"
              y2="195"
              fill="transparent"
              stroke-width="0.5"
              stroke-dasharray="2 2"
              stroke="#404040"
            />
            <line
              x1="65%"
              y1="15"
              x2="65%"
              y2="195"
              fill="transparent"
              stroke-width="0.5"
              stroke-dasharray="2 2"
              stroke="#404040"
            />
          </svg>
          <div class="temp-tag" style="top: 15px">{dict['TB']} {$values.derived.tb} °C</div>
          <div class="temp-tag" style="bottom: 18px">
            Tinj {phase == 'Injecting' ? format($values.tInj, 1, '*.*') : '20'} °C
          </div>
          <div class="x-tag" style="left: 25px">0s</div>
          <div class="x-tag" style="left:35%">10s</div>
          <div class="x-tag" style="left:65%">20s</div>
          <div class="x-tag" style="right: 25px">30s</div>
          <div class="y-tag" style="top: 10px">36.8</div>
          <div class="y-tag" style="top: 70px">36.9</div>
          <div class="y-tag" style="top: 130px">37.0</div>
          <div class="y-tag" style="top: 188px">37.1</div>
          {#if curve}
            <div
              class="curve-reveal"
              style="animation-duration: 7000ms; animation-delay: 2000ms;animation-fill-mode:forwards;animation-timing-function:linear"
            >
              <!-- <img class="curve-image" src="/assets/td-curves/{selectedTdCurve}.png" alt="td-curve" />  -->
              <TD_CurveAnimated selection={selectedTdCurve} />
            </div>
          {/if}
          <div class="large-blue">{phase_text}</div>
          {#if !curve && phase}
            <div class="flat-line"></div>
          {/if}
        </div>
        <div class="content-wrapper vertical" style="flex-grow:1">
          <div class="pair" style="flex-grow:1">
            <div class="key">
              <div class="dark-btn" style="padding:5px;">
                <img src="/assets/td_modal/history_btn_icon.svg" alt="header-icon" />
              </div>
            </div>
            <div class="value"></div>
          </div>
          <div class="divider"></div>
          <div class="pair">
            <div class="key">{dict['CI']}</div>
            <div class="value">{cipc}</div>
          </div>
          <div class="pair">
            <div class="key">{dict['GEDI']}</div>
            <div class="value">{gedi}</div>
          </div>
          <div class="pair">
            <div class="key">{dict['ELWI']}</div>
            <div class="value">{elwi}</div>
          </div>
          <div class="divider"></div>
          <div class="pair">
            <div class="key">ΔT</div>
            <div class="value">{delta_t}</div>
          </div>
          <div class="pair">
            <div class="key">Vinj</div>
            <div class="value">{v_inj}</div>
          </div>
          <div class="pair">
            <div class="key">Tinj</div>
            <div class="value">{t_inj}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    width: 860px;
    height: 482px;
    top: 0;
    left: auto;
    right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.65);
  }
  .wrapper {
    background-color: #909090;
    padding: 2px;
    border-radius: 4px;
    width: 720px;
  }
  .header {
    display: flex;
    align-items: center;
    padding: 5px;
    font-size: 16px;
    gap: 5px;
  }
  .header > span {
    color: #404040;
    font-size: 18px;
  }
  .ml-auto {
    margin-left: auto;
  }
  .mr-auto {
    margin-right: auto;
  }
  .inner-wrapper {
    background-color: #9c9c9c;
    border-radius: 5px;
    padding: 8px;
  }
  .dark-btn {
    background: linear-gradient(to bottom, #383838 0%, #181818 49%, #060606 50%);
    display: inline-flex;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }
  .dark-btn.large {
    padding: 8px 10px;
    font-size: 18px;
    border-radius: 8px;
    gap: 10px;
    border: 2px solid #000000;
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .controls > span {
    color: #404040;
    font-size: 20px;
  }
  .controls > select,
  .disabled-select {
    margin-right: 10px;
    font-size: 18px;
    padding: 8px 12px;
    border-radius: 5px;
    background: linear-gradient(#f0f0f0, #d0d0d0);
    border: 0;
  }
  .disabled-select {
    color: #202020;
    padding: 8px 12px;
    min-width: 50px;
    text-align: right;
  }
  .content {
    display: flex;
    gap: 5px;
  }
  .content-wrapper {
    border: 1px solid #404040;
    border-radius: 5px;
    background-color: #bdbdbd;
    position: relative;
  }
  .large-blue {
    color: #29abe2;
    font-size: 48px;
    text-align: center;
    position: absolute;
    left: 0;
    top: calc(50% - 24px);
    right: 0;
  }
  .temp-tag {
    color: #808080;
    font-size: 16px;
    position: absolute;
    right: 35px;
    z-index: 2;
  }
  .x-tag {
    color: #808080;
    font-size: 10px;
    position: absolute;
    bottom: 4px;
    z-index: 2;
  }
  .y-tag {
    color: #808080;
    font-size: 10px;
    position: absolute;
    left: 5px;
    z-index: 2;
  }
  .vertical {
    display: flex;
    flex-direction: column;
    color: #000000;
  }
  .pair {
    border-bottom: 1px solid #606060;
    display: flex;
  }
  .key,
  .value {
    width: 50%;
    padding: 5px 10px;
  }
  .key {
    border-right: 1px solid #606060;
  }
  .divider {
    border-top: 2px solid #606060;
  }
  .curve-reveal {
    position: absolute;
    top: 0;
    left: 30px;
    bottom: 0;
    width: 0;
    background-color: transparent;
    animation-name: reveal;
    animation-timing-function: linear;
    overflow: hidden;
  }
  .flat-line {
    position: absolute;
    top: 164px;
    left: 30px;
    width: 0;
    height: 2px;
    background-color: #29abe2;
    animation: flatline 10s linear infinite;
  }
  @keyframes flatline {
    0% {
      width: 0px;
    }
    100% {
      width: 120px;
    }
  }

  @keyframes reveal {
    0% {
      width: 0;
    }
    100% {
      width: 520px;
    }
  }
</style>
