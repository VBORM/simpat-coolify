<script>
  import { values, format } from "../stores/simulation";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary()

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
  <div class="top-label">
    <span>{dict['SVRI']}</span>
  </div>
  <span class="value">{svri}</span>
  <span class="unit">dyn*s*cm-5*-2</span>
</div>

<style>
  .wrapper {
    color: #00778e;
    position: relative;
    height: 100%;
  }
  .top-label {
    font-size: 48px;
  }

  .value {
    font-size: 80px;
    font-weight: bold;
    position: absolute;
    top: 33.3%;
    right: 15%;
  }
  .unit {
    position: absolute;
    bottom: 25%;
    right: 15%;
    font-size: 16px;
  }
</style>
