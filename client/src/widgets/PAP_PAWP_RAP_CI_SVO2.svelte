<script>
  import { values, format } from '../stores/simulation'
  import { getDictionary } from '../stores/locale';

  const dict = getDictionary()

  $: pap_systolic = format($values.derived.pap_systolic, 0, '**')
  $: pap_diastolic = format($values.derived.pap_diastolic, 0, '**')
  $: pawp = format($values.pawp, 0, '**')
  $: rap = format($values.rap, 0, '**')
  $: svo2 = format($values.svo2, 0, '**')
  $: cipc = format($values.sendCO ? $values.derived.cipc : null, 2, '*.**')
  $: m_pap = format($values.derived.m_pap, 0, '**')


  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true
    } else {
      alert('App has not received a simulation signal yet.')
    }
  }
</script>

<div class="wrapper" on:click={handleOpenTD}>
  <div class="row yellow">
    <div class="label">{dict['PAP']}</div>
    <div class="value">{pap_systolic} / {pap_diastolic}</div>
    <div class="unit">mmHg</div>
    <div class="floating-value">({m_pap})</div>
  </div>
  <div class="row green">
    <div class="label">{dict['PAWP']}</div>
    <div class="value">{pawp}</div>
    <div class="unit">mmHg</div>
  </div>
  <div class="row blue">
    <div class="label">{dict['RAP']}</div>
    <div class="value">{rap}</div>
    <div class="unit">mmHg</div>
  </div>
  <div class="split">
    <div class="row yellow">
      <div class="label">{dict['CI']}</div>
      <div class="value">{cipc}</div>
      <div class="unit">L/min/m</div>
    </div>
    <div class="row purple">
      <div class="label">{dict['SvO2']}</div>
      <div class="value">{svo2}</div>
      <div class="unit">%</div>
    </div>
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    height: 100%;
  }
  .split {
    display: flex;
    justify-content: space-between;
  }
  .split > .row {
    width: 48%;
  }
  /* Fix for unit beign too large */
  .split > .row.yellow > .unit {
    font-size: 11px;
  }
  .row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px 0;
    margin-bottom: 10px;
  }
  .label {
    font-size: 16px;
  }
  .unit {
    font-size: 16px;
    align-self: flex-end;
  }
  .value {
    font-size: 52px;
    align-self: center;
  }
  .blue {
    color: #159ed9;
    border-bottom: 1px solid #159ed9;
  }
  .purple {
    color: #9f4d9e;
    border-bottom: 1px solid #9f4d9e;
  }
  .yellow {
    color: #f2ed18;
    border-bottom: 1px solid #f2ed18;
  }
  .green {
    color: #06622c;
    border-bottom: 1px solid #06622c;
  }
</style>
