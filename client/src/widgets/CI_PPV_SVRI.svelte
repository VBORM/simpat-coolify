<script>
  import { values, td_values, format, td_elapsed } from "../stores/simulation";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary()

  $: cipc = format($td_values.dirty || $values.sendCO ? $values.derived.cipc : null, 2, '*.**');
  $: min_cipc = format($td_values.dirty ? $values.derived.min_cipc : null, 1, '*.*' );
  $: max_cipc = format( $td_values.dirty ? $values.derived.max_cipc : null, 1, '*.*');
  $: ppv = format($values.derived.ppv, 0, '*');
  $: svri = format($values.derived.svri, 0, '****');

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
        <span class="yellow-large">{dict['CI']}</span> <span class="yellow-sub">PC</span>
      </div>
      <div class="yellow-tiny">
        TD: {$td_elapsed} ago
      </div>
    </div>
    <div>
      <div class="yellow-vertical">{min_cipc}</div>
      <div class="yellow-vertical">{max_cipc}</div>
    </div>
    <div class="ml-auto">
      <div>
        <span class="yellow-large">{cipc}</span>
      </div>
      <div class="yellow-tiny text-right">l / min / m</div>
    </div>
  </div>
  <div class="row" style="bottom: 8px">
    <div class="cyan-large">{dict['PPV']}</div>
    <div class="cyan-large ml-auto mr-auto">{ppv}</div>
    <div class="cyan-large mr-auto ml-auto">{dict['SVRI']}</div>
    <div class="cyan-large ml-auto text-right">{svri}</div>
  </div>
  <div class="tiny-left">%</div>
  <div class="tiny-right">
    dyn*s*cm<sup>-5</sup>*m<sup>-2</sup>
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
  .yellow-large {
    font-size: 52px;
    color: #f7931e;
    line-height: 1;
  }
  .yellow-sub {
    font-size: 18px;
    line-height: 1;
    color: #f7931e;
  }
  .yellow-vertical {
    font-size: 16px;
    line-height: 1.5;
    color: #f7931e;
  }
  .yellow-tiny {
    line-height: 1;
    font-size: 10px;
    color: #f7931e;
  }
  .cyan-large {
    font-size: 24px;
    color: #00fefe;
  }
  .tiny-left {
    position: absolute;
    bottom: -4px;
    left: 0;
    font-size: 10px;
    color: #00fefe;
    line-height: 1;
  }
  .tiny-right {
    position: absolute;
    bottom: -4px;
    right: 0;
    font-size: 10px;
    color: #00fefe;
    line-height: 1;
  }
</style>
