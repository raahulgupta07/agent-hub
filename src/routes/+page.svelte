<script>
  import { goto } from '$app/navigation';
  import { store } from '$lib/store.svelte.js';
  import Ticker from '$lib/components/Ticker.svelte';
  import GroupTabs from '$lib/components/GroupTabs.svelte';
  import CategoryPills from '$lib/components/CategoryPills.svelte';
  import AgentCard from '$lib/components/AgentCard.svelte';
  import AdCarousel from '$lib/components/AdCarousel.svelte';
  import PinnedList from '$lib/components/PinnedList.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';

  let search = $state('');
  let category = $state('All');
  let activeGroup = $state('All');
  let paletteOpen = $state(false);
  let palette; // component ref for key handling

  let agents = $derived(store.agents);

  let filteredAgents = $derived.by(() => {
    const q = search.trim().toLowerCase();
    return agents
      .filter(
        (a) =>
          (activeGroup === 'All' || (a.group || 'City Agents') === activeGroup) &&
          (category === 'All' || a.category === category) &&
          (q === '' ||
            a.name.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q))
      )
      .sort(
        (a, b) =>
          (store.pinned.includes(b.id) ? 1 : 0) - (store.pinned.includes(a.id) ? 1 : 0)
      );
  });

  let categoryTabs = $derived(
    ['All', ...store.categories.map((c) => c.name)].map((name) => ({
      name,
      count: name === 'All' ? agents.length : agents.filter((a) => a.category === name).length
    }))
  );

  let groupTabs = $derived.by(() => {
    const order = [];
    agents.forEach((a) => {
      const g = a.group || 'City Agents';
      if (!order.includes(g)) order.push(g);
    });
    return ['All', ...order].map((name) => ({
      name,
      count:
        name === 'All'
          ? agents.length
          : agents.filter((a) => (a.group || 'City Agents') === name).length
    }));
  });

  function onKeydown(e) {
    if (paletteOpen) {
      palette?.handleKey(e);
      return;
    }
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      paletteOpen = true;
      return;
    }
    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      paletteOpen = true;
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="app">
  <header class="header">
    <div class="brand">
      <div class="logo"><span>C</span></div>
      <div>
        <div class="brand-name">City Agents <span class="em">Hub</span></div>
        <div class="brand-sub">Agent Directory</div>
      </div>
    </div>
    <div class="header-right">
      <div class="live">
        <span class="live-dot"></span>
        {agents.length} agents live
      </div>
      <button class="admin-btn" onclick={() => goto('/login')}>Admin →</button>
    </div>
  </header>

  <Ticker />

  <div class="content">
    <section class="main">
      <h1 class="title">Pick an agent, get to work</h1>

      <div class="controls">
        <div class="search">
          <input type="text" bind:value={search} placeholder="Search agents…" />
          <span class="search-ic">⌕</span>
        </div>
        <button class="jump" onclick={() => (paletteOpen = true)}>
          Jump to agent <span class="kbd">⌘K</span>
        </button>
        <div class="count">{filteredAgents.length} of {agents.length} agents</div>
      </div>

      <GroupTabs groups={groupTabs} active={activeGroup} onSelect={(n) => (activeGroup = n)} />
      <CategoryPills cats={categoryTabs} active={category} onSelect={(n) => (category = n)} />

      <div class="grid-scroll">
        {#if filteredAgents.length > 0}
          <div class="grid">
            {#each filteredAgents as agent (agent.id)}
              <AgentCard {agent} />
            {/each}
          </div>
        {:else}
          <div class="no-match">No agents match your search.</div>
        {/if}
      </div>
    </section>

    <aside class="sidebar">
      <AdCarousel />
      <PinnedList />
    </aside>
  </div>

  <footer class="footer">© 2026 City Agents Hub · Agent Directory</footer>
</div>

<CommandPalette bind:this={palette} bind:open={paletteOpen} />

<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 48px;
    border-bottom: 1px solid var(--ink-10);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 9px;
    background: var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .logo span {
    font-family: var(--serif);
    font-style: italic;
    font-size: 20px;
    color: var(--bg);
  }
  .brand-name {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .em {
    font-style: italic;
    color: var(--accent);
    font-weight: 500;
  }
  .brand-sub {
    font-family: var(--mono);
    font-size: 9.5px;
    letter-spacing: 0.14em;
    color: var(--ink-50);
    text-transform: uppercase;
    margin-top: 1px;
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .live {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-55);
    background: #fff;
    border: 1px solid var(--ink-10);
    padding: 6px 13px;
    border-radius: 20px;
  }
  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    display: inline-block;
  }
  .admin-btn {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--ink);
    background: transparent;
    border: 1px solid rgba(28, 23, 18, 0.2);
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  .admin-btn:hover {
    background: var(--ink);
    color: var(--bg);
    border-color: var(--ink);
  }
  .content {
    flex: 1;
    min-height: 0;
    display: flex;
    gap: 36px;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    padding: 24px 48px;
  }
  .main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .title {
    font-family: var(--serif);
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 14px;
    letter-spacing: -0.01em;
    flex-shrink: 0;
  }
  .controls {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
  }
  .search {
    position: relative;
    flex: 0 0 240px;
  }
  .search input {
    width: 100%;
    padding: 9px 14px 9px 32px;
    border: 1px solid var(--ink-15);
    border-radius: 9px;
    background: #fff;
    font-size: 13.5px;
    font-family: inherit;
  }
  .search-ic {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: rgba(28, 23, 18, 0.4);
  }
  .jump {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-50);
    background: #fff;
    border: 1px solid rgba(28, 23, 18, 0.12);
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    flex-shrink: 0;
    transition:
      border-color 0.15s ease,
      color 0.15s ease;
  }
  .jump:hover {
    border-color: rgba(28, 23, 18, 0.3);
    color: var(--ink);
  }
  .kbd {
    background: rgba(28, 23, 18, 0.08);
    padding: 1px 6px;
    border-radius: 4px;
  }
  .count {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-50);
    white-space: nowrap;
    flex-shrink: 0;
    margin-left: auto;
  }
  .grid-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
    gap: 16px;
    padding-bottom: 8px;
  }
  .no-match {
    padding: 60px 20px;
    text-align: center;
    color: rgba(28, 23, 18, 0.45);
    font-size: 14px;
  }
  .sidebar {
    width: 280px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
    overflow-y: auto;
  }
  .footer {
    flex-shrink: 0;
    text-align: center;
    padding: 14px;
    font-family: var(--mono);
    font-size: 10.5px;
    color: var(--ink-45);
    border-top: 1px solid rgba(28, 23, 18, 0.08);
  }
</style>
