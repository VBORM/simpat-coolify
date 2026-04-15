<script>
  import HR_Animated_Curve from "../widgets/HR_Animated_Curve.svelte";
  import AP_HR_CVP from "../widgets/AP_HR_CVP.svelte";
  import PPV from "../widgets/PPV.svelte";
  import CI from "../widgets/CI.svelte";
  import CI_Graph from "../widgets/CI_Graph.svelte";
  import SVV_SVRI_Graph from "../widgets/SVV_SVRI_Graph.svelte";
</script>

<div class="wrapper">
  <div class="box" style="grid-area: 1 / 1 / 2 / 3">
    <HR_Animated_Curve />
  </div>
  <div class="box" style="grid-area: 1 / 3 / 2 / 4">
    <AP_HR_CVP />
  </div>
  <div class="box" style="grid-area: 2 / 1 / 3 / 2">
    <CI_Graph />
  </div>
  <div class="box" style="grid-area: 3 / 1 / 4 / 2">
    <SVV_SVRI_Graph />
  </div>
  <div class="box" style="grid-area: 2 / 2 / 4 / 3">
    <!-- Empty on purpse -->
  </div>
  <div class="box" style="grid-area: 2 / 3 / 4 / 4">
    <PPV />
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
    grid-template-rows: 130px 1fr 1fr;
    grid-template-columns: 140px 1fr 1fr;
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
