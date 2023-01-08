<script>
	let key;
	let code;

	function handleKeydown(event) {
		console.log("blur")
	}
</script>

<svelte:window on:blur={handleKeydown}/>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<style>
	p {
		color: purple;
	}
</style>