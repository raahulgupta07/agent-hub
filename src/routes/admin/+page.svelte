<script>
  import { goto } from '$app/navigation';
  import IconSlot from '$lib/components/IconSlot.svelte';
  import { processLogo } from '$lib/logo.js';
  import {
    store,
    status,
    addAgent,
    removeAgent,
    updateAgent,
    updateAd,
    addTicker,
    removeTicker,
    updateTicker,
    addCategory,
    removeCategory,
    updateCategory,
    addGroup,
    removeGroup,
    updateGroup
  } from '$lib/store.svelte.js';

  const tabs = [
    { key: 'agents', name: 'Agent Cards' },
    { key: 'groups', name: 'Groups' },
    { key: 'categories', name: 'Categories' },
    { key: 'ticker', name: 'Ticker Announcements' },
    { key: 'ads', name: 'Ad Carousel' }
  ];
  let tab = $state('agents');

  // Per-agent "remove background" preference (default on) + upload busy flag.
  let stripBg = $state({});
  let busy = $state({});

  async function onLogo(agent, e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    busy[agent.id] = true;
    try {
      const dataUrl = await processLogo(file, { removeBg: stripBg[agent.id] !== false });
      updateAgent(agent.id, 'iconData', dataUrl);
    } catch (err) {
      console.error(err);
      alert('Could not process that image. Try a PNG or JPG.');
    } finally {
      busy[agent.id] = false;
    }
  }

  let saveLabel = $derived(
    status.error ? 'Save failed — retry' : status.saving ? 'Saving…' : 'All changes saved'
  );
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
      <span class="save" class:err={status.error} class:busy={status.saving}>
        <span class="save-dot"></span>{saveLabel}
      </span>
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
        <p class="hint" style="margin:0 0 16px;">
          SSO tip: you can paste a full Keycloak login URL
          (<code>…/openid-connect/auth?…</code>) into <strong>Redirect URL</strong> — it's
          auto-converted to the reusable <code>/oauth/&lt;provider&gt;/login</code> endpoint so the
          card works on every click.
        </p>
        <div class="rows">
          {#each store.agents as agent (agent.id)}
            <div class="row">
              <div class="iconcol">
                <IconSlot
                  name={agent.name}
                  category={agent.category}
                  src={agent.iconData}
                  size={56}
                  radius={10}
                />
                <label class="uploadbtn" class:busy={busy[agent.id]}>
                  {busy[agent.id] ? '…' : agent.iconData ? 'Replace' : 'Upload logo'}
                  <input type="file" accept="image/*" hidden onchange={(e) => onLogo(agent, e)} />
                </label>
                <label class="bgtoggle">
                  <input
                    type="checkbox"
                    checked={stripBg[agent.id] !== false}
                    onchange={(e) => (stripBg[agent.id] = e.target.checked)}
                  />
                  Remove bg
                </label>
                {#if agent.iconData}
                  <button class="clearlogo" onclick={() => updateAgent(agent.id, 'iconData', '')}>
                    Clear logo
                  </button>
                {/if}
              </div>
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
                  <select
                    value={agent.group}
                    onchange={(e) => updateAgent(agent.id, 'group', e.target.value)}
                  >
                    {#if agent.group && !store.groups.some((g) => g.name === agent.group)}
                      <option value={agent.group}>{agent.group}</option>
                    {/if}
                    {#each store.groups as g (g.id)}
                      <option value={g.name}>{g.name}</option>
                    {/each}
                  </select>
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
          Tip: category pills appear on the public page in this order. Assign an agent's category
          from the dropdown on the <strong>Agent Cards</strong> tab.
        </p>
      </section>
    {/if}

    {#if tab === 'groups'}
      <section>
        <div class="sec-head">
          <div>
            <h2>Groups</h2>
            <p>The top tab row on the directory (e.g. “City GPT”, “City Agents”).</p>
          </div>
          <button class="add" onclick={addGroup}>+ Add group</button>
        </div>
        <div class="rows">
          {#each store.groups as g (g.id)}
            <div class="trow">
              <input
                class="serif"
                type="text"
                value={g.name}
                oninput={(e) => updateGroup(g.id, e.target.value)}
              />
              <button class="remove sm" onclick={() => removeGroup(g.id)} aria-label="Remove">×</button>
            </div>
          {/each}
        </div>
        <p class="hint">
          Assign an agent to a group with the <strong>Group</strong> dropdown on the
          <strong>Agent Cards</strong> tab. A group's tab shows on the directory once at least one
          agent uses it.
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
  .hint code {
    font-family: var(--mono);
    font-size: 11.5px;
    background: rgba(28, 23, 18, 0.06);
    padding: 1px 5px;
    border-radius: 4px;
  }
  .save {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-50);
    margin-right: 4px;
  }
  .save-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
  }
  .save.busy .save-dot {
    background: #d97a4f;
  }
  .save.err {
    color: var(--accent);
  }
  .save.err .save-dot {
    background: var(--accent);
  }
  .iconcol {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    width: 66px;
    flex-shrink: 0;
  }
  .uploadbtn {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.02em;
    color: #fff;
    background: var(--ink);
    padding: 5px 6px;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
  }
  .uploadbtn:hover {
    background: var(--dark-2);
  }
  .uploadbtn.busy {
    opacity: 0.6;
    pointer-events: none;
  }
  .bgtoggle {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--mono);
    font-size: 8px;
    letter-spacing: 0.02em;
    color: var(--ink-50);
    cursor: pointer;
    text-transform: uppercase;
  }
  .bgtoggle input {
    accent-color: var(--accent);
    width: 12px;
    height: 12px;
    padding: 0;
  }
  .clearlogo {
    font-family: var(--mono);
    font-size: 8px;
    color: var(--ink-45);
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    text-transform: uppercase;
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
