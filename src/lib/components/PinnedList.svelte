<script>
  import IconSlot from './IconSlot.svelte';
  import { store, catColor } from '$lib/store.svelte.js';

  let pinnedAgents = $derived(store.agents.filter((a) => store.pinned.includes(a.id)));
</script>

<div class="pinned">
  <div class="label">Pinned</div>
  {#if pinnedAgents.length > 0}
    <div class="list">
      {#each pinnedAgents as pa (pa.id)}
        <a class="row" href={pa.url} target="_blank" rel="noopener">
          <IconSlot name={pa.name} category={pa.category} size={28} radius={8} />
          <div class="name">{pa.name}</div>
          <span class="dot" style="background:{catColor(pa.category)};"></span>
        </a>
      {/each}
    </div>
  {:else}
    <div class="empty">
      <span class="star">☆</span>
      <div>Pin agents you use often — click the star on any card.</div>
    </div>
  {/if}
</div>

<style>
  .pinned {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    color: var(--ink-45);
    text-transform: uppercase;
    margin-bottom: 10px;
    flex-shrink: 0;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    min-height: 0;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--ink-10);
    border-radius: 10px;
    padding: 9px 10px;
    text-decoration: none;
    color: inherit;
  }
  .row:hover {
    border-color: rgba(193, 80, 45, 0.35);
  }
  .name {
    min-width: 0;
    flex: 1;
    font-family: var(--serif);
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .empty {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 8px;
    border: 1px dashed var(--ink-15);
    border-radius: 12px;
    padding: 18px;
  }
  .star {
    font-size: 16px;
    color: rgba(28, 23, 18, 0.3);
  }
  .empty div {
    font-size: 12px;
    line-height: 1.5;
    color: var(--ink-45);
    max-width: 180px;
  }
</style>
