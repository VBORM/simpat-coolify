<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  const handleClose = () => {
    dispatch('close')
  }
  const handleSelect = (event) => {
    if (event.target.dataset.id) {
      dispatch('select', { screen: event.target.dataset.id })
    }
  }
</script>

<main class="backdrop">
  <div class="dialog">
    <svg class="close-btn" viewbox="0 0 24 24" width="24" height="24" on:click={handleClose}>
      <rect fill="rgba(255,0,0,0.75)" stroke-width="0" x="0" y="0" width="24" height="24" />
      <path fill="transparent" stroke-width="1" stroke="white" d="M 4 4 L 20 20" />
      <path fill="transparent" stroke-width="1" stroke="white" d="M 20 4 L 4 20" />
    </svg>
    <div class="options-list" on:click={handleSelect}>
      <img data-id="10" src="/assets/screen_select/screen10.svg" alt="" />
      <img data-id="17" src="/assets/screen_select/screen17.svg" alt="" />
      <img data-id="9" src="/assets/screen_select/screen9.svg" alt="" />
      <img data-id="8" src="/assets/screen_select/screen8.svg" alt="" />
      <img data-id="4" src="/assets/screen_select/screen4.svg" alt="" />
      <img data-id="3" src="/assets/screen_select/screen3.svg" alt="" />
      <img data-id="2" src="/assets/screen_select/screen2.svg" alt="" />
      <img data-id="7" src="/assets/screen_select/screen7.svg" alt="" />
      <img data-id="1" src="/assets/screen_select/screen1.svg" alt="" />
      <img data-id="5" src="/assets/screen_select/screen5.svg" alt="" />
      <img data-id="6" src="/assets/screen_select/screen6.svg" alt="" />
      <img data-id="13" src="/assets/screen_select/screen13.svg" alt="" />
      <img data-id="14" src="/assets/screen_select/screen14.svg" alt="" />
      <img data-id="15" src="/assets/screen_select/screen15.svg" alt="" />
      <img data-id="16" src="/assets/screen_select/screen16.svg" alt="" />
    </div>
  </div>
</main>

<style>
  .backdrop {
    position: absolute;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dialog {
    position: relative;
    background-color: black;
    border: 2px solid #404040;
    border-radius: 5px;
    padding: 30px;
    width: 96%;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    user-select: none;
  }
  .options-list {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
  }
  .options-list > img {
    cursor: pointer;
    width: 120px;
  }
</style>
