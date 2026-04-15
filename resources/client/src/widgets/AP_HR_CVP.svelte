<script>
  import { values, td_values, format, td_elapsed } from "../stores/simulation";
  import { getDictionary } from '../stores/locale';

  const dict = getDictionary();

  $: min_sap = format($values.derived.min_sap, 0, '***');
  $: max_sap = format($values.derived.max_sap, 0, '***');
  $: sap = format($values.derived.sap, 0, '***');
  $: dap = format($values.derived.dap,0,'***');
  $: map = format($values.derived.map,0,'***');
  $: min_hr = format($values.derived.min_hr,0,'***');
  $: max_hr = format($values.derived.max_hr,0,'***');
  $: hr = format($values.derived.hr,0,'***');
  $: cvp = format($values.derived.cvp,0,'**');

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true;
    } else {
      alert("App has not received a simulation signal yet.");
    }
  };
</script>

<div class="wrapper" on:click={handleOpenTD}>
  <div class="row" style="top: 0">
    <div class="red-large">{dict['AP']}</div>
    <!--setting opacity to zero instead of removing it avoid layout issue-->
    <div
      class="red-small"
      style="margin-top:5px; margin-right: 5px; margin-left:10%;opacity:0"
    >
      {min_sap} <br />
      {max_sap}
    </div>
    <div class="red-large mr-auto">
      {sap} / {dap}
    </div>
    <div class="red-large">
      <div>({map})</div>
      <div class="red-small text-right">mmHg</div>
    </div>
  </div>
  <div class="row" style="top: 38%">
    <div class="red-large">{dict['HR']}</div>
    <!--setting opacity to zero instead of removing it avoid layout issue-->
    <div
      class="red-small"
      style="margin-top:5px; margin-right: 5px; margin-left:10%;opacity:0"
    >
      {min_hr} <br />
      {max_hr}
    </div>
    <div class="red-large mr-auto">{hr}</div>
    <div class="red-small text-right" style="align-self:flex-end">BPM</div>
  </div>
  <div class="row" style="bottom: 4px">
    <div class="cyan-large">{dict['CVP']}</div>
    <div class="cyan-large mr-auto ml-auto">{cvp}</div>
    <div class="cyan-small text-right" style="align-self:flex-end">mmHg</div>
  </div>
  <div class="timestamp">
    Last input {$td_elapsed} ago
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .row {
    position: absolute;
    display: flex;
    align-items: flex-start;
    left: 0;
    right: 0;
  }
  .text-right {
    text-align: right;
  }
  .mr-auto {
    margin-right: auto;
  }
  .ml-auto {
    margin-left: auto;
  }
  .red-large {
    font-size: 24px;
    color: red;
  }
  .red-small {
    font-size: 10px;
    color: red;
  }
  .cyan-large {
    font-size: 24px;
    color: #00fefe;
  }
  .cyan-small {
    font-size: 10px;
    color: #00fefe;
  }
  .timestamp {
    position: absolute;
    bottom: -3px;
    left: 0;
    font-size: 10px;
    color: #00fefe;
    line-height: 1;
  }
</style>
