<script>
  import { values } from '../stores/simulation'

  import { onDestroy } from 'svelte'
  const cancelAnimationFrame = window.cancelAnimationFrame

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true
    } else {
      alert('App has not received a simulation signal yet.')
    }
  }

  export let width = 380
  const curvePath = '/assets/pac-curves/pac-curves.svg#PCW-green'


  let animationframe
  $: running = $values.hrCurve ? true : false

  const gap_size = 40;
  let gap_x = -gap_size;
  let gap_speed_x = 1;

  function step() {
    if (running) {
      if (gap_x < width) {
        gap_x += gap_speed_x;
      } else {
        gap_x = -gap_size;
      }
    } else {
      gap_x = -gap_size;
    }
    animationframe = window.requestAnimationFrame(step)
  }

  animationframe = window.requestAnimationFrame(step)

  onDestroy(() => {
    cancelAnimationFrame(animationframe)
  })
</script>

<div class="wrapper" on:click={handleOpenTD}>
  {#if $values.pawp > 0 && running}
    <svg
      class="plot-image"
      viewBox="0 0 {width} 109"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
    >
      <use
        xlink:href={curvePath}
        vector-effect="non-scaling-stroke"
        x="0"
        y="-10"
      />
    </svg>
    {/if}
    <svg class="plot" viewBox="0 0 700 110">
      <rect x="{gap_x}" y="0" width="{gap_size}" height="110" fill="#141414" stroke="none"/>
      <path stroke="#f0f0f0" stroke-width="1" stroke-dasharray="6 6" d="M 0 0 l 700 0" />
      <path stroke="#f0f0f0" stroke-width="1" stroke-dasharray="3 3" d="M 0 55 l 700 0" />
      <path stroke="#f0f0f0" stroke-width="1" stroke-dasharray="6 6" d="M 0 108 l 700 0" />
  </svg>
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    color: #a0a0a0;
  }
  .plot {
    position: absolute;
    top: 0;
    left: 30px;
    height: 100%;
  }
  .plot-image {
    position: absolute;
    top: 0;
    left: 30px;
    height: 100%;
  }
</style>
