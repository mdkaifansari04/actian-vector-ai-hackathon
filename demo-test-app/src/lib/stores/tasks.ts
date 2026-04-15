import { derived, writable } from 'svelte/store';

export type Task = {
	id: string;
	title: string;
	done: boolean;
	createdAt: number;
};

const initialTasks: Task[] = [
	{
		id: 'seed-1',
		title: 'Read the Svelte stores guidance',
		done: false,
		createdAt: Date.now() - 120000
	},
	{
		id: 'seed-2',
		title: 'Create a shared writable store',
		done: true,
		createdAt: Date.now() - 90000
	}
];

const internal = writable<Task[]>(initialTasks);

function makeTask(title: string): Task {
	return {
		id: crypto.randomUUID(),
		title,
		done: false,
		createdAt: Date.now()
	};
}

export const tasks = {
	subscribe: internal.subscribe,
	add(title: string) {
		const normalized = title.trim();
		if (!normalized) return;
		internal.update((all) => [makeTask(normalized), ...all]);
	},
	toggle(taskId: string) {
		internal.update((all) => all.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)));
	},
	remove(taskId: string) {
		internal.update((all) => all.filter((task) => task.id !== taskId));
	},
	clearCompleted() {
		internal.update((all) => all.filter((task) => !task.done));
	}
};

export const taskStats = derived(internal, ($tasks) => {
	const total = $tasks.length;
	const completed = $tasks.filter((task) => task.done).length;
	const open = total - completed;
	const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

	return {
		total,
		completed,
		open,
		completionRate
	};
});
