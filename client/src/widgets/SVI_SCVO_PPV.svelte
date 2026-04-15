<script>
  import { values, td_values, format } from "../stores/simulation";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary()

  $: svi = format($td_values.dirty || $values.sendCO ? $values.derived.svi : null, 0, "**");
  $: scvo = format($values.derived.scvo, 0, '**');
  $: ppv = format($values.derived.ppv, 0, '**');

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true;
    } else {
      alert("App has not received a simulation signal yet.");
    }
  };
</script>

<div class="wrapper" on:click={handleOpenTD}>
  <div class="orange">
    <div>{dict['SVI']}</div>
    <div>{svi}</div>
  </div>
  <div class="purple">
    <div>{dict['ScvO2']}</div>
    <div>{scvo}</div>
  </div>
  <div class="cyan">
    <div>{dict['PPV']}</div>
    <div>{ppv}</div>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    font-size: 24px;
  }
  .orange {
    color: #f6800b;
    display: flex;
    justify-content: space-between;
  }
  .purple {
    color: #9c184b;
    display: flex;
    justify-content: space-between;
  }
  .cyan {
    color: #007785;
    display: flex;
    justify-content: space-between;
  }
</style>
