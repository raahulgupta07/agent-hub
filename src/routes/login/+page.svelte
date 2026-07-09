<script>
  import { enhance } from '$app/forms';
  import { store } from '$lib/store.svelte.js';

  let { form } = $props();
</script>

<div class="wrap">
  <div class="left">
    <div class="brand">
      <div class="logo"><span>C</span></div>
      <div class="brand-name">City Agents <span class="em">Hub</span></div>
    </div>
    <h1 class="title">Sign in to manage <span class="em">City Agents Hub</span></h1>
    <p class="sub">Configure agent cards, categories and communications shown on the directory.</p>

    <form class="form" method="POST" use:enhance>
      {#if form?.error}
        <div class="error">{form.error}</div>
      {/if}

      <label for="email">Email</label>
      <input id="email" name="email" type="email" placeholder="you@city.gov" value={form?.email ?? ''} required />

      <label for="password">Password</label>
      <input id="password" name="password" type="password" placeholder="••••••••••" required />

      <button class="submit" type="submit">Continue with email →</button>
      <a class="back" href="/">← Back to directory</a>
    </form>
  </div>

  <div class="right">
    <div class="live-tag"><span class="dot"></span> Live</div>
    <div class="right-title">How the directory stays current</div>
    <div class="steps">
      <div class="step">
        <div class="num">1</div>
        <div>
          <div class="step-title">Add an agent</div>
          <div class="step-desc">Name, icon, category and destination link.</div>
        </div>
      </div>
      <div class="step">
        <div class="num">2</div>
        <div>
          <div class="step-title">Publish</div>
          <div class="step-desc">Goes live on the directory instantly.</div>
        </div>
      </div>
      <div class="step">
        <div class="num">3</div>
        <div>
          <div class="step-title">Discover</div>
          <div class="step-desc">Staff search or browse by category from one page.</div>
        </div>
      </div>
    </div>
    <div class="right-foot">
      <span>{store.agents.length} agents · {store.categories.length} categories</span>
      <span class="saved"><span class="dot green"></span>Autosaved</span>
    </div>
  </div>
</div>

<style>
  .wrap {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--bg);
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 96px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 56px;
  }
  .logo {
    width: 36px;
    height: 36px;
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
    font-size: 18px;
    color: var(--bg);
  }
  .brand-name {
    font-family: var(--serif);
    font-size: 16px;
    font-weight: 600;
  }
  .em {
    font-style: italic;
    color: var(--accent);
    font-weight: 500;
  }
  .title {
    font-family: var(--serif);
    font-size: 44px;
    font-weight: 600;
    line-height: 1.15;
    margin: 0 0 16px;
    letter-spacing: -0.01em;
    max-width: 520px;
  }
  .sub {
    color: rgba(28, 23, 18, 0.6);
    font-size: 15px;
    margin: 0 0 40px;
    max-width: 440px;
    line-height: 1.5;
  }
  .form {
    max-width: 440px;
    display: flex;
    flex-direction: column;
  }
  .error {
    background: rgba(193, 80, 45, 0.1);
    border: 1px solid rgba(193, 80, 45, 0.35);
    color: var(--accent-hover);
    font-size: 13px;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .form label {
    font-family: var(--mono);
    font-size: 10.5px;
    letter-spacing: 0.12em;
    color: var(--ink-50);
    text-transform: uppercase;
  }
  .form input[type='email'],
  .form input[type='password'] {
    width: 100%;
    margin: 8px 0 20px;
    padding: 14px 16px;
    border: 1px solid var(--ink-15);
    border-radius: 10px;
    background: #fff;
    font-size: 14px;
    font-family: inherit;
  }
  .remember {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(28, 23, 18, 0.7);
    margin-bottom: 28px;
    text-transform: none;
    letter-spacing: 0;
    font-family: var(--sans);
  }
  .remember input {
    accent-color: var(--accent);
  }
  .submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    background: var(--ink);
    color: var(--bg);
    border: none;
    padding: 16px;
    border-radius: 10px;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .submit:hover {
    background: var(--dark-2);
  }
  .back {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    color: var(--ink-50);
    text-decoration: none;
  }
  .right {
    background: var(--dark);
    color: var(--ticker-text);
    padding: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .live-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #d97a4f;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #d97a4f;
    display: inline-block;
  }
  .dot.green {
    background: #8fbf9f;
  }
  .right-title {
    font-family: var(--serif);
    font-size: 26px;
    font-weight: 500;
    line-height: 1.35;
    margin-bottom: 40px;
    max-width: 420px;
  }
  .steps {
    display: flex;
    flex-direction: column;
    gap: 26px;
    max-width: 440px;
  }
  .step {
    display: flex;
    gap: 16px;
  }
  .num {
    width: 26px;
    height: 26px;
    border-radius: 7px;
    background: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--mono);
    font-size: 12px;
    flex-shrink: 0;
  }
  .step-title {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 3px;
  }
  .step-desc {
    font-size: 13.5px;
    color: rgba(237, 231, 220, 0.6);
    line-height: 1.5;
  }
  .right-foot {
    position: absolute;
    bottom: 48px;
    left: 64px;
    right: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-family: var(--mono);
    font-size: 12px;
    color: rgba(237, 231, 220, 0.5);
  }
  .saved {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #8fbf9f;
  }
</style>
