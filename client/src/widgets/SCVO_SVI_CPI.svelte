<script>
  import { values, td_values, format } from "../stores/simulation";
  import { getDictionary } from "../stores/locale";
  
  const dict = getDictionary()

  $: svi = format($td_values.dirty || $values.sendCO ? $values.derived.svi : null , 0, "***");
  $: scvo = format($values.derived.scvo, 0, '**');
  $: min_scvo = format($values.derived.min_scvo, 0, '**');
  $: max_scvo = format($values.derived.max_scvo, 0, '**');
  $: cpi = $td_values.dirty || $values.sendCO ? format($values.derived.cpi,2,"*.**") : "*.**";

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
    <div class="mr-auto">
      <div>
        <span class="purple-large">{dict['ScvO2']}</span>
      </div>
    </div>
    <div>
      <div class="purple-vertical">{min_scvo}</div>
      <div class="purple-vertical">{max_scvo}</div>
    </div>
    <div class="ml-auto">
      <div>
        <span class="purple-large">{scvo}</span>
      </div>
      <div class="purple-tiny text-right">%</div>
    </div>
  </div>
  <div class="row" style="bottom: 8px">
    <div class="yellow-large">{dict['SVI']}</div>
    <div class="yellow-large ml-auto mr-auto">{svi}</div>
    <div class="green-large mr-auto ml-auto">{dict['CPI']}</div>
    <div class="green-large ml-auto text-right">{cpi}</div>
  </div>
  <div class="tiny-left">
    ml/m<sup>2</sup>
  </div>
  <div class="tiny-right">
    W/m<sup>2</sup>
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
  .purple-large {
    font-size: 52px;
    color: #e61b6a;
    line-height: 1;
  }
  .purple-sub {
    font-size: 18px;
    line-height: 1;
    color: #e61b6a;
  }
  .purple-vertical {
    font-size: 16px;
    line-height: 1.5;
    color: #e61b6a;
  }
  .purple-tiny {
    line-height: 1;
    font-size: 10px;
    color: #e61b6a;
  }
  .green-large {
    font-size: 24px;
    color: #027432;
  }
  .yellow-large {
    font-size: 24px;
    color: #f7931e;
  }
  .tiny-left {
    position: absolute;
    bottom: -4px;
    left: 0;
    font-size: 10px;
    line-height: 1;
    color: #f7931e;
  }
  .tiny-right {
    position: absolute;
    bottom: -4px;
    right: 0;
    font-size: 10px;
    color: #027432;
    line-height: 1;
  }
</style>
