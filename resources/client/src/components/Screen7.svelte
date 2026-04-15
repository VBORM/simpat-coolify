<script>
  import HR_Animated_Curve from "../widgets/HR_Animated_Curve.svelte";
  import AP_HR_CVP from "../widgets/AP_HR_CVP.svelte";
  import CI_SVV_Graph from '../widgets/CI_SVV_Graph.svelte';
  import CI_PPV_SVRI from '../widgets/CI_PPV_SVRI.svelte';
  import SCVO_SVI_CPI from '../widgets/SCVO_SVI_CPI.svelte';
</script>

<div class="wrapper">
  <div class="box" style="grid-area: 1 / 1 / 2 / 2">
    <HR_Animated_Curve/>
  </div>
  <div class="box" style="grid-area: 1 / 2 / 2 / 3">
    <AP_HR_CVP/>
  </div>
  <div class="box" style="grid-area: 2 / 1 / 4 / 2">
    <CI_SVV_Graph />
  </div>
  <div class="box" style="grid-area: 2 / 2 / 3 / 3">
    <CI_PPV_SVRI />
  </div>
  <div class="box" style="grid-area: 3 / 2 / 4 / 3">
    <SCVO_SVI_CPI />
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
    grid-template-columns: 440px 1fr;
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
