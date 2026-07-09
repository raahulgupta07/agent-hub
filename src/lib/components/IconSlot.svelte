<script>
  import { catColor } from '$lib/store.svelte.js';

  // Renders an uploaded logo (src, a data-URL) when present; otherwise a colored
  // initial tile keyed to the agent's category.
  let { name = '', category = '', size = 48, radius = 12, src = '' } = $props();

  // Strip a leading "City GPT —"/"City Agent" prefix so the initial is meaningful.
  let initial = $derived.by(() => {
    const cleaned = name.replace(/^City (GPT|Agent)\s*[—-]?\s*/i, '').trim();
    return (cleaned || name || '?').charAt(0).toUpperCase();
  });

  let color = $derived(catColor(category));
</script>

{#if src}
  <div
    class="logo-tile"
    style="width:{size}px;height:{size}px;border-radius:{radius}px;padding:{Math.round(size * 0.12)}px;"
  >
    <img src={src} alt={name} />
  </div>
{:else}
  <div
    class="icon-slot"
    style="width:{size}px;height:{size}px;border-radius:{radius}px;background:color-mix(in oklch, {color} 18%, #fff);color:{color};font-size:{size * 0.42}px;"
  >
    {initial}
  </div>
{/if}

<style>
  .icon-slot,
  .logo-tile {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    user-select: none;
  }
  .icon-slot {
    font-family: var(--serif);
    font-weight: 600;
  }
  .logo-tile {
    background: #fff;
    border: 1px solid var(--ink-10);
    overflow: hidden;
  }
  .logo-tile img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
</style>
