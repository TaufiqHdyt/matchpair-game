<script lang="ts">
  import { app } from '$lib/config'

  import '../app.css'
</script>

<svelte:head>
  <title>{app.title}</title>
</svelte:head>

<slot />
