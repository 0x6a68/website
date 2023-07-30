<script>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { webVitals } from '$lib/vitals';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
  import './styles.css';

  export let data;

  $: if (browser && data?.analyticsId) {
    webVitals({
      path: $page.url.pathname,
      params: $page.params,
      analyticsId: data.analyticsId
    });
  }
</script>

<div class="app">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</div>

<style>
  .app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100dvh;
  }
  main {
    display: grid;
    place-content: center;
    gap: 1ch;
  }
</style>
