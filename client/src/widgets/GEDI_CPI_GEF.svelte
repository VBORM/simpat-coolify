<script>
  import { td_values, values, format, td_elapsed } from "../stores/simulation";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary()

  $: gedi = $td_values.dirty ? format($td_values.gedi,0,"***") : "***";
  $: cpi = $td_values.dirty || $values.sendCO ? format($values.derived.cpi,2,"*.**") : "*.**";
  $: gef = $td_values.dirty ? format($td_values.gef,0,"***") : "***";

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true;
    } else {
      alert("App has not received a simulation signal yet.");
    }
  };

  $: gef_nromalized = gef !== Infinity && gef !== -Infinity ? gef : "***";
</script>

<div class="wrapper" on:click={handleOpenTD}>
  <div class="cyan">
    <div>
      <div>{dict['GEDI']}</div>
      <div class="unit">
        TD: {$td_elapsed} ago
      </div>
    </div>
    <div>{gedi}</div>
  </div>
  <div class="green">
    <div>{dict['CPI']}</div>
    <div>{cpi}</div>
  </div>
  <div class="cyan">
    <div>
      <div>{dict['GEF']}</div>
      <div class="unit">
        TD: {$td_elapsed} ago
      </div>
    </div>
    <div>{gef_nromalized}</div>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    font-size: 22px;
  }
  .green {
    color: #06622c;
    display: flex;
    justify-content: space-between;
  }
  .unit {
    font-size: 10px;
  }
  .cyan {
    color: #007785;
    display: flex;
    justify-content: space-between;
  }
</style>
