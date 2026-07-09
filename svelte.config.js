import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // Origin is not fixed (varies by host/port, possibly behind a proxy). CSRF is
    // instead handled by the sameSite=lax session cookie, which the browser will
    // not send on cross-site POST/PUT — so unauthenticated writes get 401 anyway.
    csrf: { checkOrigin: false }
  }
};

export default config;
