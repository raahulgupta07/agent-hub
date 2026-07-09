<script>
  import { goto } from '$app/navigation';
  import IconSlot from '$lib/components/IconSlot.svelte';
  import {
    store,
    addAgent,
    removeAgent,
    updateAgent,
    updateAd,
    addTicker,
    removeTicker,
    updateTicker,
    addCategory,
    removeCategory,
    updateCategory
  } from '$lib/store.svelte.js';

  const tabs = [
    { key: 'agents', name: 'Agent Cards' },
    { key: 'categories', name: 'Categories' },
    { key: 'ticker', name: 'Ticker Announcements' },
    { key: 'ads', name: 'Ad Carousel' }
  ];
  let tab = $state('agents');
</script>

<div class="admin">
  <header class="header">
    <div class="brand">
      <div class="logo"><span>C</span></div>
      <div class="brand-row">
        <div class="brand-name">City Agents <span class="em">Hub</span></div>
        <div class="badge">Admin</div>
      </div>
    </div>
    <div class="header-right">
      <button class="ghost" onclick={() => goto('/')}>View public page</button>
      <a class="solid" href="/logout" data-sveltekit-reload>Log out</a>
    </div>
  </header>

  <main class="main">
    <div class="tabs">
      {#each tabs as t (t.key)}
        <button class="tab" class:active={t.key === tab} onclick={() => (tab = t.key)}>
          {t.name}
        </button>
      {/each}
    </div>

    {#if tab === 'agents'}
      <section>
        <div class="sec-head">
          <div>
            <h2>Agent Cards</h2>
            <p>Shown in the searchable, category-filtered grid on the public page.</p>
          </div>
          <button class="add" onclick={addAgent}>+ Add agent</button>
        </div>
        <div class="rows">
          {#each store.agents as agent (agent.id)}
            <div class="row">
              <IconSlot name={agent.name} category={agent.category} size={56} radius={10} />
              <div class="fields">
                <div class="field">
                  <label>Name</label>
                  <input
                    class="serif"
                    type="text"
                    value={agent.name}
                    oninput={(e) => updateAgent(agent.id, 'name', e.target.value)}
                  />
                </div>
                <div class="field">
                  <label>Group</label>
                  <input
                    type="text"
                    placeholder="e.g. City GPT"
                    value={agent.group}
                    oninput={(e) => updateAgent(agent.id, 'group', e.target.value)}
                  />
                </div>
                <div class="field">
                  <label>Category</label>
                  <select
                    value={agent.category}
                    onchange={(e) => updateAgent(agent.id, 'category', e.target.value)}
                  >
                    {#each store.categories as c (c.id)}
                      <option value={c.name}>{c.name}</option>
                    {/each}
                  </select>
                </div>
                <div class="field">
                  <label>Redirect URL</label>
                  <input
                    class="mono"
                    type="text"
                    value={agent.url}
                    oninput={(e) => updateAgent(agent.id, 'url', e.target.value)}
                  />
                </div>
                <div class="field full">
                  <label>Description</label>
                  <input
                    type="text"
                    value={agent.description}
                    oninput={(e) => updateAgent(agent.id, 'description', e.target.value)}
                  />
                </div>
              </div>
              <button class="remove" onclick={() => removeAgent(agent.id)} aria-label="Remove">×</button>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if tab === 'categories'}
      <section>
        <div class="sec-head">
          <div>
            <h2>Categories</h2>
            <p>Drive the category filter pills and the colored dot on every agent card.</p>
          </div>
          <button class="add" onclick={addCategory}>+ Add category</button>
        </div>
        <div class="rows">
          {#each store.categories as c (c.id)}
            <div class="crow">
              <span class="swatch" style="background:{c.color};"></span>
              <div class="cfield">
                <label>Name</label>
                <input
                  class="serif"
                  type="text"
                  value={c.name}
                  oninput={(e) => updateCategory(c.id, 'name', e.target.value)}
                />
              </div>
              <div class="cfield">
                <label>Color (any CSS color — hex or oklch)</label>
                <input
                  class="mono"
                  type="text"
                  value={c.color}
                  oninput={(e) => updateCategory(c.id, 'color', e.target.value)}
                />
              </div>
              <button class="remove" onclick={() => removeCategory(c.id)} aria-label="Remove">×</button>
            </div>
          {/each}
        </div>
        <p class="hint">
          Tip: the directory's <strong>group tabs</strong> (e.g. “City GPT”, “City Agents”) are set
          per agent via the <strong>Group</strong> field on the Agent Cards tab — type a new group
          name and a new tab appears automatically.
        </p>
      </section>
    {/if}

    {#if tab === 'ticker'}
      <section>
        <div class="sec-head">
          <div>
            <h2>Ticker Announcements</h2>
            <p>Scrolls continuously below the header on the public page.</p>
          </div>
          <button class="add" onclick={addTicker}>+ Add announcement</button>
        </div>
        <div class="rows">
          {#each store.tickerItems as t (t.id)}
            <div class="trow">
              <input
                type="text"
                value={t.text}
                oninput={(e) => updateTicker(t.id, e.target.value)}
              />
              <button class="remove sm" onclick={() => removeTicker(t.id)} aria-label="Remove">×</button>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    {#if tab === 'ads'}
      <section>
        <h2>Ad Carousel</h2>
        <p class="lead">Three fixed placements that rotate automatically in the sidebar.</p>
        <div class="rows">
          {#each store.ads as ad (ad.id)}
            <div class="row">
              <div class="ad-thumb">Ad image</div>
              <div class="ad-fields">
                <div class="field">
                  <label>Headline</label>
                  <input
                    class="serif"
                    type="text"
                    value={ad.headline}
                    oninput={(e) => updateAd(ad.id, 'headline', e.target.value)}
                  />
                </div>
                <div class="field">
                  <label>Description</label>
                  <input
                    type="text"
                    value={ad.description}
                    oninput={(e) => updateAd(ad.id, 'description', e.target.value)}
                  />
                </div>
                <div class="field">
                  <label>Link URL</label>
                  <input
                    class="mono"
                    type="text"
                    value={ad.url}
                    oninput={(e) => updateAd(ad.id, 'url', e.target.value)}
                  />
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/if}
  </main>
</div>

<style>
  .admin {
    min-height: 100vh;
    background: var(--bg);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 48px;
    border-bottom: 1px solid var(--ink-10);
    background: var(--surface);
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
    font-size: 19px;
    color: var(--bg);
  }
  .brand-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand-name {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 600;
  }
  .em {
    font-style: italic;
    color: var(--accent);
    font-weight: 500;
  }
  .badge {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--accent);
    background: rgba(193, 80, 45, 0.1);
    padding: 4px 9px;
    border-radius: 6px;
    text-transform: uppercase;
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ghost {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink);
    background: transparent;
    border: 1px solid rgba(28, 23, 18, 0.2);
    padding: 9px 16px;
    border-radius: 8px;
    cursor: pointer;
  }
  .ghost:hover {
    background: rgba(28, 23, 18, 0.05);
  }
  .solid {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--bg);
    background: var(--ink);
    border: none;
    padding: 9px 16px;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }
  .solid:hover {
    background: var(--dark-2);
  }
  .main {
    max-width: 1080px;
    margin: 0 auto;
    padding: 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  .tabs {
    display: flex;
    align-items: flex-end;
    gap: 32px;
    border-bottom: 1px solid rgba(28, 23, 18, 0.14);
  }
  .tab {
    font-family: var(--serif);
    font-size: 17px;
    font-weight: 500;
    color: rgba(28, 23, 18, 0.4);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0 0 12px 0;
    margin-bottom: -1px;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .tab.active {
    font-weight: 700;
    color: var(--ink);
    border-bottom-color: var(--accent);
  }
  .sec-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  h2 {
    font-family: var(--serif);
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 4px;
  }
  .sec-head p,
  .lead {
    margin: 0;
    font-size: 13px;
    color: var(--ink-55);
  }
  .lead {
    margin: 0 0 20px;
  }
  .add {
    font-family: var(--mono);
    font-size: 11px;
    color: #fff;
    background: var(--accent);
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .add:hover {
    background: var(--accent-red);
  }
  .rows {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .row {
    display: flex;
    gap: 18px;
    align-items: flex-start;
    background: #fff;
    border: 1px solid var(--ink-10);
    border-radius: 12px;
    padding: 18px;
  }
  .fields {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 12px;
  }
  .ad-fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .field.full {
    grid-column: 1 / 5;
  }
  label {
    font-family: var(--mono);
    font-size: 9.5px;
    letter-spacing: 0.1em;
    color: var(--ink-45);
    text-transform: uppercase;
  }
  input,
  select {
    padding: 10px 12px;
    border: 1px solid var(--ink-15);
    border-radius: 8px;
    font-size: 13px;
    font-family: var(--sans);
    background: #fff;
  }
  input.serif {
    font-family: var(--serif);
    font-size: 14px;
  }
  input.mono {
    font-family: var(--mono);
  }
  .trow {
    display: flex;
    gap: 12px;
    align-items: center;
    background: #fff;
    border: 1px solid var(--ink-10);
    border-radius: 10px;
    padding: 12px 14px;
  }
  .trow input {
    flex: 1;
    padding: 9px 12px;
    font-size: 13.5px;
  }
  .remove {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--ink-15);
    background: #fff;
    color: var(--ink-50);
    cursor: pointer;
    font-size: 16px;
    flex-shrink: 0;
  }
  .remove.sm {
    width: 32px;
    height: 32px;
    font-size: 15px;
  }
  .remove:hover {
    background: #fbeae5;
    border-color: var(--accent);
    color: var(--accent);
  }
  .crow {
    display: flex;
    gap: 14px;
    align-items: flex-end;
    background: #fff;
    border: 1px solid var(--ink-10);
    border-radius: 12px;
    padding: 16px 18px;
  }
  .swatch {
    width: 40px;
    height: 40px;
    border-radius: 9px;
    flex-shrink: 0;
    border: 1px solid var(--ink-15);
    margin-bottom: 2px;
  }
  .cfield {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .crow .cfield:nth-of-type(1) {
    flex: 0 0 240px;
  }
  .crow .cfield:nth-of-type(2) {
    flex: 1;
  }
  .hint {
    margin: 18px 2px 0;
    font-size: 12.5px;
    line-height: 1.6;
    color: var(--ink-55);
  }
  .ad-thumb {
    width: 140px;
    height: 100px;
    border-radius: 10px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #d97a4f 0%, #c1502d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.85);
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
  }
</style>
