<script>
  import { catColor } from '$lib/store.svelte.js';

  let { cats, active, onSelect } = $props();

  function pillStyle(cat) {
    const isAll = cat.name === 'All';
    const color = isAll ? '#1C1712' : catColor(cat.name);
    const on = cat.name === active;
    const tint = isAll ? 'rgba(28,23,18,0.08)' : `color-mix(in oklch, ${color} 14%, transparent)`;
    const bg = on ? tint : 'transparent';
    const fg = on ? (isAll ? '#1C1712' : color) : 'rgba(28,23,18,0.5)';
    const weight = on ? 600 : 400;
    return `background:${bg};color:${fg};font-weight:${weight};`;
  }
</script>

<div class="scroll">
  <div class="row">
    {#each cats as cat (cat.name)}
      <button class="pill" style={pillStyle(cat)} onclick={() => onSelect(cat.name)}>
        {cat.name}
        <span style="opacity:0.6;">{cat.count}</span>
      </button>
    {/each}
  </div>
  <div class="fade"><span>›</span></div>
</div>

<style>
  .scroll {
    flex-shrink: 0;
    position: relative;
    margin-bottom: 20px;
  }
  .row {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding: 2px 36px 2px 0;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--mono);
    font-size: 12px;
    padding: 7px 14px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  .fade {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to right, rgba(242, 238, 230, 0), #f2eee6 65%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    pointer-events: none;
  }
  .fade span {
    font-size: 13px;
    color: rgba(28, 23, 18, 0.3);
    padding-right: 2px;
  }
</style>
