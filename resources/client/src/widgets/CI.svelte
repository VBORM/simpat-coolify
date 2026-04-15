<script>
  import { values, td_values, format, td_elapsed } from "../stores/simulation";
  import { getDictionary } from "../stores/locale";

  const dict = getDictionary();

  $: cipc = format($td_values.dirty || $values.sendCO ? $values.derived.cipc : null, 2, '*.**');
  $: min_cipc = format($td_values.dirty ? $values.derived.min_cipc : null, 1, '*.*' );
  $: max_cipc = format( $td_values.dirty ? $values.derived.max_cipc : null, 1, '*.*');

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
    <span>{dict['CI']}</span><span class="subscript">PC</span>
  </div>
  <span class="mini-value-top">{min_cipc}</span>
  <span class="mini-value-bottom">{max_cipc}</span>
  <span class="value">{cipc}</span>
  <span class="unit">l/min/m<sup>2</sup></span>
  <span class="time">
    TD: {$td_elapsed} ago
  </span>
</div>

<style>
  .wrapper {
    color: #f7931e;
    position: relative;
    height: 100%;
  }
  .top-label {
    font-size: 48px;
  }
  .subscript {
    margin-left: 5px;
    font-size: 16px;
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
  .mini-value-top {
    position: absolute;
    top: 33.3%;
    font-size: 16px;
    left: 5%;
  }
  .mini-value-bottom {
    position: absolute;
    top: 60%;
    font-size: 16px;
    left: 5%;
  }
  .time {
    color: #f7931e;
    font-size: 16px;
    position: absolute;
    bottom: 10px;
    left: 5px;
  }
</style>
