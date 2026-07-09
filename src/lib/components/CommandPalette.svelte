<script>
  import { store, catColor } from '$lib/store.svelte.js';

  let { open = $bindable() } = $props();

  let query = $state('');
  let index = $state(0);

  let results = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return store.agents;
    return store.agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  });

  // Wrapped, clamped active index.
  let activeIndex = $derived(
    results.length ? ((index % results.length) + results.length) % results.length : 0
  );

  // Reset query/index whenever the palette opens.
  $effect(() => {
    if (open) {
      query = '';
      index = 0;
    }
  });

  function pick(agent) {
    if (!agent) return;
    window.open(agent.url, '_blank', 'noopener');
    open = false;
  }

  export function handleKey(e) {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      open = false;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      index = activeIndex + 1;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      index = activeIndex - 1;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(results[activeIndex]);
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="overlay" onclick={() => (open = false)} role="presentation">
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="panel" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
      <div class="search">
        <span class="ic">⌕</span>
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          autofocus
          bind:value={query}
          oninput={() => (index = 0)}
          placeholder="Jump to an agent…"
        />
        <span class="esc">esc</span>
      </div>
      <div class="results">
        {#if results.length > 0}
          {#each results as r, i (r.id)}
            <button class="rrow" class:active={i === activeIndex} onclick={() => pick(r)}>
              <span class="dot" style="background:{catColor(r.category)};"></span>
              <span class="name">{r.name}</span>
              <span class="desc">{r.description}</span>
            </button>
          {/each}
        {:else}
          <div class="none">No agents match.</div>
        {/if}
      </div>
      <div class="foot">
        <span>↑↓ navigate</span>
        <span>↵ open</span>
        <span>esc close</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(20, 16, 12, 0.5);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 14vh;
    z-index: 50;
  }
  .panel {
    width: 560px;
    max-width: 90vw;
    max-height: 60vh;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border-radius: 14px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  .search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-bottom: 1px solid var(--ink-10);
    flex-shrink: 0;
  }
  .ic {
    font-size: 15px;
    color: rgba(28, 23, 18, 0.4);
  }
  .search input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    font-family: inherit;
    background: transparent;
  }
  .esc {
    font-family: var(--mono);
    font-size: 10px;
    color: rgba(28, 23, 18, 0.4);
    border: 1px solid var(--ink-15);
    padding: 2px 6px;
    border-radius: 5px;
  }
  .results {
    overflow-y: auto;
    padding: 8px;
  }
  .rrow {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    text-align: left;
    padding: 10px 12px;
    border-radius: 9px;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .rrow.active {
    background: rgba(193, 80, 45, 0.1);
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .name {
    font-family: var(--serif);
    font-size: 14.5px;
    font-weight: 600;
    flex-shrink: 0;
  }
  .desc {
    font-size: 12.5px;
    color: var(--ink-50);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .none {
    padding: 32px 16px;
    text-align: center;
    color: rgba(28, 23, 18, 0.4);
    font-size: 13px;
  }
  .foot {
    padding: 10px 18px;
    border-top: 1px solid var(--ink-10);
    display: flex;
    gap: 16px;
    font-family: var(--mono);
    font-size: 10.5px;
    color: var(--ink-45);
    flex-shrink: 0;
  }
</style>
