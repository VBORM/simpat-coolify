<script>
  import { values, format } from '../stores/simulation'
  import { getDictionary } from '../stores/locale'

  const dict = getDictionary()

  $: hr = format($values.derived.hr, 0, '**')
  $: spo2 = format($values.derived.spo2, 0, '**')
  $: resp = format($values.derived.resp, 0, '**')
  $: tb = format($values.derived.tb, 1, '**.*')
  $: etco2 = format($values.derived.etco2, 0, '**')

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true
    } else {
      alert('App has not received a simulation signal yet.')
    }
  }
</script>

<div class="wrapper" on:click={handleOpenTD}>
  <div class="row red">
    <div class="label">{dict['HR']}</div>
    <div class="value">{hr}</div>
    <div class="unit">BPM</div>
  </div>
  <div class="row cyan">
    <div class="label">{dict['SPO2']}</div>
    <div class="value">{spo2}</div>
    <div class="unit">%</div>
  </div>
  <div class="row yellow">
    <div class="label">
      <div>RESP</div>
      <div class="sub-label">
        {dict['etCO2']} <br />
        {etco2} mmHg
      </div>
    </div>
    <div class="value">{resp}</div>
    <div class="unit">Brth / min</div>
  </div>
  <div class="row green">
    <div class="label">{dict['TB']}</div>
    <div class="value">{tb}</div>
    <div class="unit"><sup>o</sup>C</div>
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    height: 100%;
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
  .red {
    color: red;
    border-bottom: 1px solid red;
  }
  .green {
    color: #06622c;
  }
  .cyan {
    color: #007785;
    border-bottom: 1px solid #007785;
  }
  .yellow {
    color: #f7931e;
    border-bottom: 1px solid #f7931e;
  }
  .sub-label {
    font-size: 12px;
    margin-top: 10px;
  }
</style>
