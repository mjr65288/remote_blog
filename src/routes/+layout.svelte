<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '@drop-in/graffiti';

	let { children } = $props();
	
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="layout-readable center">
	{@render children()}
</main>

<style>
	header {
		border-bottom: solid 1px var(--tint-or-shade);
		.layout-readable {
			align-items: center;
		}
		padding-block: var(--vs-s);
	}
	main {
		padding-block: var(--vs-m);
	}
</style>