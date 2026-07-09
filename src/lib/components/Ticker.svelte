<script>
  import { store } from '$lib/store.svelte.js';

  let hover = $state(false);
  // Duplicate the list so the -50% translate loops seamlessly.
  let loop = $derived([...store.tickerItems, ...store.tickerItems]);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="ticker"
  onmouseenter={() => (hover = true)}
  onmouseleave={() => (hover = false)}
>
  <div class="track" style="animation-play-state:{hover ? 'paused' : 'running'};">
    {#each loop as item, i (item.id + '-' + i)}
      <span class="item">
        <span class="dot"></span>
        {item.text}
      </span>
    {/each}
  </div>
</div>

<style>
  .ticker {
    flex-shrink: 0;
    background: var(--dark);
    overflow: hidden;
    padding: 9px 0;
    white-space: nowrap;
  }
  .track {
    display: inline-flex;
    align-items: center;
    gap: 40px;
    padding-left: 40px;
    animation: cah-ticker 32s linear infinite;
  }
  .item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ticker-text);
    flex-shrink: 0;
  }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #d97a4f;
    display: inline-block;
    flex-shrink: 0;
  }
</style>
