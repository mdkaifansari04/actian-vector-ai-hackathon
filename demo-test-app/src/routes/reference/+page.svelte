<script lang="ts">
	const sourceRefs = [
		'https://svelte.dev/docs/svelte/stores',
		'https://svelte.dev/docs/svelte/best-practices',
		'https://svelte.dev/docs/svelte/$state'
	];
</script>

<section class="panel prose">
	<h2>DocuMind Reference Notes</h2>
	<p>
		This app structure is based on the ingested <code>svelte-docs</code> namespace, with shared state in a
		writable store and local UI state handled with <code>$state</code>.
	</p>
	<h3>Implementation choices</h3>
	<ul>
		<li>Use writable stores for cross-route shared task data.</li>
		<li>Use derived stores for computed analytics.</li>
		<li>Use local <code>$state</code> only for transient page-local values.</li>
	</ul>
	<h3>Primary source refs</h3>
	<ul>
		{#each sourceRefs as source}
			<li><a href={source}>{source}</a></li>
		{/each}
	</ul>
	<h3>Known gap</h3>
	<p>
		The seeded corpus is from <code>svelte.dev/docs/svelte/*</code>, so it does not include SvelteKit routing
		docs. Route layout here follows standard file-based SvelteKit conventions as best effort.
	</p>
</section>
