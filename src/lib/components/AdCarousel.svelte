<script>
  import { store } from '$lib/store.svelte.js';

  let index = $state(0);
  let progress = $state(0);
  let paused = $state(false);
  let hover = $state(false);

  let ads = $derived(store.ads);
  let current = $derived(ads[index % ads.length] ?? { headline: '', description: '', url: '' });

  // Auto-advance: 5s per ad (100 ticks of 100ms, +2 each tick).
  $effect(() => {
    const t = setInterval(() => {
      if (hover || paused || ads.length === 0) return;
      const next = progress + 100 / 50;
      if (next >= 100) {
        index = (index + 1) % ads.length;
        progress = 0;
      } else {
        progress = next;
      }
    }, 100);
    return () => clearInterval(t);
  });

  function segFill(i) {
    if (i < index) return 100;
    if (i === index) return progress;
    return 0;
  }
  function jump(i) {
    index = i;
    progress = 0;
  }
</script>

<div class="ad-label">Sponsored</div>
<div
  class="ad"
  onmouseenter={() => (hover = true)}
  onmouseleave={() => (hover = false)}
  role="region"
  aria-label="Sponsored"
>
  <div class="media">
    <a class="media-link" href={current.url} target="_blank" rel="noopener" aria-label={current.headline}>
      <div class="img">Ad image</div>
    </a>
    <div class="scrim"></div>
    <div class="segments">
      {#each ads as ad, i (ad.id)}
        <button class="seg" onclick={() => jump(i)} aria-label={'Go to ad ' + (i + 1)}>
          <div class="fill" style="width:{segFill(i)}%;"></div>
        </button>
      {/each}
    </div>
    <button class="pause" onclick={() => (paused = !paused)} aria-label={paused ? 'Play' : 'Pause'}>
      {paused ? '▶' : '⏸'}
    </button>
  </div>
  <a class="text" href={current.url} target="_blank" rel="noopener">
    <div class="tag">Ad</div>
    <div class="headline">{current.headline}</div>
    <div class="desc">{current.description}</div>
  </a>
</div>

<style>
  .ad-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    color: var(--ink-45);
    text-transform: uppercase;
    flex-shrink: 0;
  }
  .ad {
    background: var(--surface);
    border: 1px solid var(--ink-10);
    border-radius: 14px;
    overflow: hidden;
    flex-shrink: 0;
    transition:
      box-shadow 0.15s ease,
      border-color 0.15s ease;
  }
  .ad:hover {
    box-shadow: 0 10px 22px rgba(28, 23, 18, 0.08);
    border-color: rgba(193, 80, 45, 0.35);
  }
  .media {
    position: relative;
  }
  .media-link {
    display: block;
  }
  .img {
    width: 100%;
    height: 190px;
    background: linear-gradient(135deg, #d97a4f 0%, #c1502d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.85);
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.08em;
  }
  .scrim {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 52px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
    pointer-events: none;
  }
  .segments {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 44px;
    display: flex;
    gap: 5px;
  }
  .seg {
    flex: 1;
    height: 3px;
    padding: 0;
    border: none;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.35);
    overflow: hidden;
    cursor: pointer;
  }
  .fill {
    height: 100%;
    background: #fff;
    border-radius: 2px;
    transition: width 120ms linear;
  }
  .pause {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 16px;
  }
  .tag {
    font-family: var(--mono);
    font-size: 9.5px;
    letter-spacing: 0.1em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 7px;
  }
  .headline {
    font-family: var(--serif);
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .desc {
    font-size: 13px;
    line-height: 1.5;
    color: rgba(28, 23, 18, 0.6);
  }
</style>
