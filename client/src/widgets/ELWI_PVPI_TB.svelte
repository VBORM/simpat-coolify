<script>
  import { values, td_values, format, td_elapsed } from "../stores/simulation";
  import { formatTimeElapsed } from "../stores/utils";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary();

  $: elwi = format($td_values.elwi, 0 ,'***');
  $: pvpi = format($td_values.pvpi, 1 ,'**.*');
  $: tb = format($values.derived.tb, 1, '**.*');

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true;
    } else {
      alert("App has not received a simulation signal yet.");
    }
  };
</script>

<div class="wrapper" on:click={handleOpenTD}>
  <div class="green">
    <div>
      <div>{dict['ELWI']}</div>
      <div class="unit">
        TD: {$td_elapsed} ago
      </div>
    </div>
    <div>{elwi}</div>
  </div>
  <div class="green">
    <div>
      <div>PVPI</div>
      <div class="unit">
        TD: {$td_elapsed} ago
      </div>
    </div>
    <div>{pvpi}</div>
  </div>
  <div class="green">
    <div>{dict['TB']}</div>
    <div>{tb}</div>
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
</style>
