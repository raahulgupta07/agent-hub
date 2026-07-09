<script>
  import '../app.css';
  import { hydrate } from '$lib/store.svelte.js';

  let { data, children } = $props();

  // Seed the shared store from the server load payload (runs once per component
  // instance: server render + client hydration).
  hydrate(data);
</script>

{@render children()}
