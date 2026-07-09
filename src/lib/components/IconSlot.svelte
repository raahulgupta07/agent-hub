<script>
  import { catColor } from '$lib/store.svelte.js';

  // Colored initial tile — replaces the design's image-slot placeholder.
  let { name = '', category = '', size = 48, radius = 12 } = $props();

  // Strip a leading "City GPT —"/"City Agent" prefix so the initial is meaningful.
  let initial = $derived.by(() => {
    const cleaned = name
      .replace(/^City (GPT|Agent)\s*[—-]?\s*/i, '')
      .trim();
    return (cleaned || name || '?').charAt(0).toUpperCase();
  });

  let color = $derived(catColor(category));
</script>

<div
  class="icon-slot"
  style="width:{size}px;height:{size}px;border-radius:{radius}px;background:color-mix(in oklch, {color} 18%, #fff);color:{color};font-size:{size * 0.42}px;"
>
  {initial}
</div>

<style>
  .icon-slot {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--serif);
    font-weight: 600;
    line-height: 1;
    user-select: none;
  }
</style>
