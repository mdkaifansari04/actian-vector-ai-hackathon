<script lang="ts">
	import { tasks } from '$lib/stores/tasks';

	let draft = $state('');
	let hideCompleted = $state(false);

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		tasks.add(draft);
		draft = '';
	}

	let visibleTasks = $derived(hideCompleted ? $tasks.filter((task) => !task.done) : $tasks);
</script>

<section class="panel">
	<h2>Task Inbox</h2>
	<p class="muted">
		Local form state uses <code>$state</code>, while cross-route data is stored in a shared writable store.
	</p>

	<form class="task-form" onsubmit={onSubmit}>
		<input
			name="task"
			bind:value={draft}
			placeholder="Add a task based on the docs..."
			autocomplete="off"
		/>
		<button type="submit" disabled={draft.trim().length === 0}>Add task</button>
	</form>

	<div class="action-row">
		<label>
			<input type="checkbox" bind:checked={hideCompleted} />
			Hide completed
		</label>
		<span class="muted">Showing {visibleTasks.length} of {$tasks.length}</span>
	</div>

	{#if visibleTasks.length === 0}
		<p class="muted">No tasks match this filter.</p>
	{:else}
		<ul class="task-list">
			{#each visibleTasks as task (task.id)}
				<li class:done={task.done} class="task-item">
					<div class="task-main">
						<input
							id={`task-${task.id}`}
							type="checkbox"
							checked={task.done}
							onchange={() => tasks.toggle(task.id)}
						/>
						<label for={`task-${task.id}`}>{task.title}</label>
					</div>
					<button class="ghost" type="button" onclick={() => tasks.remove(task.id)}>Remove</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>
