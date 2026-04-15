<section class="panel prose">
	<h2>DocuMind Reference Notes</h2>
	<p>
		This app structure is based on the ingested <code>svelte-docs</code> namespace and now uses a static
		UI with no todo workflow state.
	</p>
	<h3>Implementation choices</h3>
	<ul>
		<li>Keep routes focused on reference content instead of task operations.</li>
		<li>Remove writable and derived stores that only supported todo behavior.</li>
		<li>Retain a minimal layout shell for future feature work.</li>
	</ul>
	<h3>Primary source refs</h3>
	<ul>
		<li>
			<a href="https://svelte.dev/docs/svelte/stores">https://svelte.dev/docs/svelte/stores</a>
		</li>
		<li>
			<a href="https://svelte.dev/docs/svelte/best-practices"
				>https://svelte.dev/docs/svelte/best-practices</a
			>
		</li>
		<li>
			<a href="https://svelte.dev/docs/svelte/$state">https://svelte.dev/docs/svelte/$state</a>
		</li>
	</ul>
	<h3>Known gap</h3>
	<p>
		The seeded corpus is from <code>svelte.dev/docs/svelte/*</code>, so it does not include
		SvelteKit routing docs. Route layout here follows standard file-based SvelteKit conventions as
		best effort.
	</p>
</section>
