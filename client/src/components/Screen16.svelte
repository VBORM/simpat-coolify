<script>
  import { values, format } from '../stores/simulation'
  import { getDictionary } from '../stores/locale';

  const dict = getDictionary()

  $: pbw = format($values.derived.pbw, 1, '*.*')
  $: peep = format($values.peep, 1, '**.*')
  $: p_peak = format($values.p_peak, 0, '**')
  $: fio2 = format($values.fio2, 0, '')
  $: vt_e = format($values.vt_e, 0, '***')
  $: tv = format($values.derived.tv, 1, '*.*')
  $: mv_e = format($values.derived.mv_e, 1, '*.*')
  $: etco2 = format($values.derived.etco2, 0, '**')

  $: stroke_color = $values.p_peak > 40 ? '#f74931' : '#e2b069'

  let dashLength = 0
  let animationFrame
  let t_start = null
  const radius = 40
  function computeMaxLength(p_peak) {
    return Math.PI * radius * (p_peak / 40)
  }
  // Animation step
  function step(currentTime) {
    if (t_start === null) t_start = currentTime
    const elapsed = (currentTime - t_start) / 1000
    const resp = $values.resp || 12
    const freq = resp / 60
    const maxLength = computeMaxLength($values.p_peak || 40)
    dashLength = ((Math.sin(2 * Math.PI * freq * elapsed) + 1) / 2) * maxLength
    animationFrame = requestAnimationFrame(step)
  }
  animationFrame = requestAnimationFrame(step)
</script>

<div class="wrapper">
  <section class="header">
    <span>{dict[$values.vent_control] || $values.vent_control || 'no-vent-control'}</span>
    <span>{dict['PBW']} = {pbw}</span>
    <span>
      <!-- empty on purpose -->
    </span>
  </section>
  <div class="svg-box">
    <div class="svg-label">
      <div>{dict['Tidal Volume']}</div>
      <div>{tv} mL/kg</div>
    </div>
    <svg width="125" viewBox="0 0 100 105" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cyan-gradient">
          <stop offset="35%" stop-color="#319fc180" />
          <stop offset="100%" stop-color="#319fc120" />
        </radialGradient>
        <radialGradient id="orange-gradient">
          <stop offset="0%" stop-color="#f7493180" />
          <stop offset="100%" stop-color="#f7493100" />
        </radialGradient>
      </defs>
      <!-- Breath indicator -->
      <path
        d="M 60 15 A 40 40 0 1 1 40 15"
        stroke={stroke_color}
        stroke-width="15"
        stroke-dasharray="{dashLength} {Math.PI * 2 * radius - dashLength}"
        fill="none"
      />
      <path d="M 60 15 A 40 40 0 1 1 40 15" stroke="none" fill="#202020" />
      <!-- Flask -->
      <path
        d="M 40 0 L 40 15 A 40 40 0 1 0 60 15 L 60 0"
        stroke="black"
        stroke-width="5"
        fill="none"
      />
      <!-- White Circle -->
      <circle cx="50" cy="54" r="32" stroke-width="1" stroke="#a0a0a0" fill="none"></circle>
      <!-- Blue cirlce -->
      <circle cx="50" cy="54" r="30" stroke="none" fill="url(#cyan-gradient)"></circle>
      {#if fio2}
        <text text-anchor="middle" x="50%" y="56%" fill="#2090ff">{fio2}%</text>
      {/if}
    </svg>
  </div>
  <div class="box">
    <div class="label">{dict['PEEP']}</div>
    <div class="value text-yellow">
      {peep}
    </div>
    <div class="unit text-yellow">cmH<sub>2</sub>O</div>
  </div>
  <div class="box">
    <div class="label">{dict['Ppeak']}</div>
    <div class="value text-yellow">{p_peak}</div>
    <div class="unit text-yellow">cmH<sub>2</sub>O</div>
  </div>
  <div class="box">
    <div class="label">{dict['etCO2']}</div>
    <div class="value text-cyan">{etco2}</div>
    <div class="unit text-cyan">mmHg</div>
  </div>
  <div class="box">
    <div class="label">{dict['VTe']}</div>
    <div class="value text-cyan">{vt_e}</div>
    <div class="unit text-cyan">ml</div>
  </div>
  <div class="box">
    <div class="label">{dict['MVe']}</div>
    <div class="value text-cyan">{mv_e}</div>
    <div class="unit text-cyan">l/min</div>
  </div>
</div>

<style>
  .wrapper {
    display: grid;
    gap: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    grid-template-rows: auto 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    height: 100%;
  }
  .header {
    grid-area: 1 / 1 / 2 / 4;
    padding: 6px 12px;
    background-color: #202020;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #a0a0a0;
    font-size: 18px;
  }
  .box {
    min-width: 0;
    min-height: 0;
    background: #202020;
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
  .svg-box {
    min-width: 0;
    min-height: 0;
    background: radial-gradient(#282828, #242424);
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
  .svg-box > svg {
    display: block;
    margin: 8px auto 0 auto;
  }
  .label {
    align-self: flex-start;
    color: #a0a0a0;
    font-size: 20px;
    padding: 8px;
    height: 60px;
  }
  .svg-label {
    font-size: 14px;
    color: #a0a0a0;
    padding: 0;
  }
  .unit {
    font-weight: 600;
    text-align: center;
  }
  .text-yellow {
    color: #e2b069;
  }
  .text-cyan {
    color: #609fa7;
  }
  .value {
    font-size: 60px;
    font-weight: bold;
    text-align: center;
  }
</style>
