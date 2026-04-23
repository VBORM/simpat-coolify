<script>
  import { values, signal_values, format } from '../stores/simulation'
  import { getDictionary } from '../stores/locale'

  const dict = getDictionary()

  export let label = dict['ABP']
  export let stable = false
  export let showCvp = true

  $: stableMapValue =
    typeof $signal_values.sap === 'number' && typeof $signal_values.dap === 'number'
      ? $signal_values.dap + ($signal_values.sap - $signal_values.dap) / 3
      : null
  $: sap = stable ? format($signal_values.sap, 0, '**') : format($values.derived.sap, 0, '**')
  $: dap = stable ? format($signal_values.dap, 0, '**') : format($values.derived.dap, 0, '**')
  $: map = stable ? format(stableMapValue, 0, '**') : format($values.derived.map, 0, '**')
  $: cvp = stable ? format($signal_values.cvp, 0, '**') : format($values.derived.cvp, 0, '**')

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true
    } else {
      alert('App has not received a simulation signal yet.')
    }
  }
</script>

<div class="wrapper row" on:click={handleOpenTD}>
  <div class="top-left red-small">{label}</div>
  <span class="value red-large"> {sap} / {dap} </span>
  <div class="right-column" class:compact={!showCvp}>
    <div class="top-right red-small">({map})</div>
    {#if showCvp}
      <div class="cvp-line cyan-small">
        <span>{dict['CVP']}</span>
        <span>{cvp}</span>
      </div>
    {/if}
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
    gap: 16px;
  }

  .top-left,
  .top-right,
  .cyan-small {
    font-size: 24px;
    line-height: 1.1;
  }

  .red-large {
    color: red;
  }

  .red-small {
    color: red;
  }

  .cyan-small {
    color: #00fefe;
  }

  .value {
    font-size: 48px;
    font-weight: bold;
    text-align: center;
    align-self: center;
    white-space: nowrap;
  }

  .right-column {
    min-width: 120px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    text-align: right;
    margin-left: auto;
  }

  .right-column.compact {
    justify-content: flex-start;
  }

  .cvp-line {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin-top: auto;
    white-space: nowrap;
  }
</style>
