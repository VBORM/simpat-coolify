<script>
  import ABP from '../widgets/ABP.svelte'
  import PAP_PAWP_RAP_CI_SVO2 from '../widgets/PAP_PAWP_RAP_CI_SVO2.svelte'
  import PAP_Animated_Curve from '../widgets/PAP_Animated_Curve.svelte'
  import PCW_Green_Curve from '../widgets/PCW_Green_Curve.svelte'
  import RA_Blue_Curve from '../widgets/RA_Blue_Curve.svelte'
</script>

<div class="wrapper">
  <div class="box" style="grid-area: 1 / 1 / 2 / 2">
    <PAP_Animated_Curve width={572} />
  </div>
  <div class="box" style="grid-area: 2 / 1 / 3 / 2">
    <PCW_Green_Curve width={572} />
  </div>
  <div class="box" style="grid-area: 3 / 1 / 4 / 2">
    <RA_Blue_Curve width={572} />
  </div>
  <div class="box" style="grid-area: 4 / 1 / 5 / 2">
    <ABP />
  </div>
  <div class="box" style="grid-area: 1 / 2 / 5 / 3">
    <PAP_PAWP_RAP_CI_SVO2 />
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
    grid-template-rows: 1fr 1fr 1fr 1fr;
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
