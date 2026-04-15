<script>
  import { values } from "../stores/simulation";
  import { onDestroy } from 'svelte';

  const cancelAnimationFrame = window.cancelAnimationFrame;

  const handleOpenTD = () => {
    if ($values.td_available) {
      $values.td_open = true;
    } else {
      alert("App has not received a simulation signal yet.");
    }
  };

  const offset = 30;
  let speedX = 1;
  export let width = 380;

  
  let running = true;

  let posClip1 = -offset;
  let posClip2 = posClip1 - width - offset;


  let selectedCurve1 = "";
  let selectedCurve2 = "/assets/resp/resp-curves.svg#respcurve_default";

  let animationframe;

  const curvePath = "/assets/resp/resp-curves.svg#";


 $: running = $values.hrCurve ? true: false; 

  function step() {
    posClip1 = running ? posClip1 + speedX : posClip1;

    if (posClip1 > width + offset) {
      posClip1 = (width + offset) * (-1);
      selectedCurve1 = selectedCurve2;
    }

    if (posClip1 >= 0){
      posClip2 = posClip1 - width - offset;
    }else{
      posClip2 = posClip1 + width + offset
    }
      
    animationframe = window.requestAnimationFrame(step);
  }
  animationframe = window.requestAnimationFrame(step);

  onDestroy(()=>{
    cancelAnimationFrame(animationframe);
  });
</script>

<div class="wrapper" on:click={handleOpenTD}>
  <div class="top-limit">40</div>
  <div class="bottom-limit">1</div>
  {#if $values.hrCurve}
    <svg
      class="plot-image"
      viewBox="0 0 {width} 109"
      version="1.1"
      id="svg5"
      inkscape:version="1.1 (c68e22c387, 2021-05-23)"
      sodipodi:docname="animation.svg"
      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
    >
      <sodipodi:namedview
        id="namedview7"
        pagecolor="#ffffff"
        bordercolor="#666666"
        borderopacity="1.0"
        inkscape:pageshadow="2"
        inkscape:pageopacity="0.0"
        inkscape:pagecheckerboard="0"
        inkscape:document-units="mm"
        showgrid="false"
        inkscape:zoom="0.33540614"
        inkscape:cx="-64.10139"
        inkscape:cy="445.72827"
        inkscape:window-width="2560"
        inkscape:window-height="1377"
        inkscape:window-x="-8"
        inkscape:window-y="-8"
        inkscape:window-maximized="1"
        inkscape:current-layer="g954"
      />
      <defs id="defs2">
        <g
          inkscape:label="animation"
          inkscape:groupmode="layer"
          id="g954"
          style="display:inline"
        >
          <clipPath id="respclippath1" clipPathUnits="userSpaceOnUse">
            <rect
              style="fill:#000000;fill-rule:evenodd;stroke-width:0.264583;-inkscape-stroke:none;stop-color:#000000"
              id="rect950"
              width={width}
              height="109"
              x={posClip1}
              y="0"
            />
          </clipPath>

          <clipPath id="respclippath2" clipPathUnits="userSpaceOnUse">
            <rect
              style="fill:#000000;fill-rule:evenodd;stroke-width:0.264583;-inkscape-stroke:none;stop-color:#000000"
              id="rect952"
              width={width}
              height="109"
              x={posClip2}
              y="0"
            />
          </clipPath>
        </g>
      </defs>
      <g inkscape:label="curveuse" inkscape:groupmode="layer" id="layer2">
        <use
          xlink:href={selectedCurve1}
          clip-path="url(#respclippath1)"
          vector-effect="non-scaling-stroke"
          x="0"
          y="-10.0"
        />
        <use
          xlink:href={selectedCurve2}
          clip-path="url(#respclippath2)"
          vector-effect="non-scaling-stroke"
          x="0"
          y="-10.0"
        />
      </g>
    </svg>
  {/if}
  <svg class="plot" viewBox="0 0 700 110">
    <path
      stroke="#f0f0f0"
      stroke-width="1"
      stroke-dasharray="6 6"
      d="M 0 0 l 700 0"
    />
    <path
      stroke="#f0f0f0"
      stroke-width="1"
      stroke-dasharray="3 3"
      d="M 0 55 l 700 0"
    />
    <path
      stroke="#f0f0f0"
      stroke-width="1"
      stroke-dasharray="6 6"
      d="M 0 110 l 700 0"
    />
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
  .top-limit {
    position: absolute;
    font-size: 12px;
    left: 0;
    top: 0;
    width: 25px;
    text-align: right;
  }
  .bottom-limit {
    position: absolute;
    font-size: 12px;
    left: 0;
    bottom: 0;
    width: 25px;
    text-align: right;
  }
  .plot-image {
    position: absolute;
    top: 0;
    left: 30px;
    height: 100%;
  }
</style>
