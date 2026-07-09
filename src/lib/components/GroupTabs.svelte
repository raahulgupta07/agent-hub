<script>
  let { groups, active, onSelect } = $props();
</script>

<div class="scroll">
  <div class="pills">
    {#each groups as g (g.name)}
      <button class="pill" class:active={g.name === active} onclick={() => onSelect(g.name)}>
        {g.name}
        <span class="count" class:active={g.name === active}>{g.count}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .scroll {
    flex-shrink: 0;
    position: relative;
    margin-bottom: 14px;
  }
  .pills {
    display: inline-flex;
    gap: 4px;
    background: rgba(28, 23, 18, 0.05);
    border-radius: 999px;
    padding: 4px;
    overflow-x: auto;
    max-width: 100%;
  }
  .pill {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--serif);
    font-size: 15px;
    font-weight: 500;
    padding: 10px 18px;
    border-radius: 999px;
    border: none;
    background: transparent;
    color: var(--ink-55);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  .pill.active {
    background: var(--ink);
    color: var(--bg);
    font-weight: 600;
  }
  .count {
    font-family: var(--mono);
    font-size: 11px;
    padding: 1px 7px;
    border-radius: 999px;
    background: rgba(28, 23, 18, 0.06);
    color: var(--ink-45);
  }
  .count.active {
    background: rgba(242, 238, 230, 0.18);
    color: rgba(242, 238, 230, 0.85);
  }
</style>
