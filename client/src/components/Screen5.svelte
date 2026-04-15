<script>
  import HR_Animated_Curve from '../widgets/HR_Animated_Curve.svelte';
  import AP_HR_CVP from '../widgets/AP_HR_CVP.svelte';
  import SVI_SVV_PPV from '../widgets/SVI_SVV_PPV.svelte';
  import CI_Graph from '../widgets/CI_Graph.svelte';
  import Organview from '../widgets/Organview.svelte';

</script>

<div class="wrapper">
  <div class="box" style="grid-area: 1 / 1 / 4 / 2">
    <Organview />
  </div>
  <div class="box" style="grid-area: 1 / 2 / 2 / 4">
    <HR_Animated_Curve width={340} />
  </div>
  <div class="box" style="grid-area: 2 / 2 / 3 / 4">
    <AP_HR_CVP />
  </div>
  <div class="box" style="grid-area: 3 / 2 / 4 / 3">
    <SVI_SVV_PPV/>
  </div>
  <div class="box" style="grid-area: 3 / 3 / 4 / 4">
    <CI_Graph/>
  </div>

</div>

<style>
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 8px;
    gap: 8px;
    display: grid;
    grid-template-rows: 130px 130px 1fr;
    grid-template-columns: 440px 1fr 1fr;
  }
  .box {
    border-radius: 4px;
    border-top: 1px solid #404040;
    position: relative;
    background-color: #141414;
    overflow: hidden;
    padding: 10px 15px;
  }
</style>
