<script lang="ts">
	import { taskStats, tasks } from '$lib/stores/tasks';
</script>

<section class="panel">
	<h2>Analytics</h2>
	<p class="muted">This route reads a <code>derived</code> store computed from the shared task store.</p>

	<div class="stats-grid">
		<article>
			<h3>Total tasks</h3>
			<p>{$taskStats.total}</p>
		</article>
		<article>
			<h3>Open tasks</h3>
			<p>{$taskStats.open}</p>
		</article>
		<article>
			<h3>Completed</h3>
			<p>{$taskStats.completed}</p>
		</article>
		<article>
			<h3>Completion</h3>
			<p>{$taskStats.completionRate}%</p>
		</article>
	</div>

	<div class="action-row">
		<span class="muted">Actions apply globally because the writable store is shared across routes.</span>
		<button type="button" onclick={() => tasks.clearCompleted()} disabled={$taskStats.completed === 0}>
			Clear completed
		</button>
	</div>
</section>
