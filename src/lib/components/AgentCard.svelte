<script>
  import IconSlot from './IconSlot.svelte';
  import { catColor, isPinned, togglePin } from '$lib/store.svelte.js';

  let { agent } = $props();
  let pinned = $derived(isPinned(agent.id));

  function onPin(e) {
    e.preventDefault();
    e.stopPropagation();
    togglePin(agent.id);
  }
</script>

<div class="wrap">
  <a class="card" href={agent.url} target="_blank" rel="noopener">
    <IconSlot name={agent.name} category={agent.category} src={agent.iconData} size={48} radius={12} />
    <div class="body">
      <div class="name">{agent.name}</div>
      <div class="cat">
        <span class="dot" style="background:{catColor(agent.category)};"></span>
        <span class="cat-label">{agent.category}</span>
      </div>
    </div>
    <div class="desc">{agent.description}</div>
  </a>
  <button
    class="pin"
    class:active={pinned}
    onclick={onPin}
    aria-label={pinned ? 'Unpin' : 'Pin'}
  >
    {pinned ? '★' : '☆'}
  </button>
</div>

<style>
  .wrap {
    position: relative;
    min-width: 0;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    background: var(--surface);
    border: 1px solid var(--ink-10);
    border-radius: 14px;
    padding: 20px 14px;
    text-decoration: none;
    color: inherit;
    min-width: 0;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      border-color 0.15s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(28, 23, 18, 0.08);
    border-color: rgba(193, 80, 45, 0.35);
  }
  .body {
    min-width: 0;
    width: 100%;
  }
  .name {
    font-family: var(--serif);
    font-size: 14.5px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cat {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-family: var(--mono);
    font-size: 8.5px;
    letter-spacing: 0.06em;
    color: var(--ink-50);
    text-transform: uppercase;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
  }
  .cat-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }
  .desc {
    font-size: 11.5px;
    line-height: 1.45;
    color: var(--ink-55);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .pin {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    border-radius: 7px;
    border: none;
    background: transparent;
    color: rgba(28, 23, 18, 0.25);
    font-size: 13px;
    line-height: 24px;
    cursor: pointer;
    padding: 0;
  }
  .pin.active {
    background: rgba(193, 80, 45, 0.12);
    color: var(--accent);
  }
</style>
