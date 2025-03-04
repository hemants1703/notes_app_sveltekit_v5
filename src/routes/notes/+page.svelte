<script lang="ts">
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { authToken } from '$lib/stores/auth';

	let notes: Array = $state([]);
	let selectedNote: object | null = $state(null);
	let searchQuery: string = $state('');
	let loading: boolean = $state(true);
	let showToast: boolean = $state(false);
	let toastMessage: string = $state('');
	let toastType: string = $state('success');
	let filteredNotes: Array = $state([]);

	$effect(() => {
		const fn = async () => {
			await fetchNotes();
		};

		loading = false;

		filteredNotes = searchQuery
			? notes.filter(
					(note) =>
						note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						note.content.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: notes;
	});

	async function fetchNotes() {
		try {
			// First get the user data
			const userResponse = await fetch('/api/auth/user', {
				headers: {
					'Authorization': `Bearer ${$authToken}`
				}
			});

			if (!userResponse.ok) {
				showNotification('Authentication failed', 'error');
				return;
			}

			const userData = await userResponse.json();

			// Then fetch notes for this user
			const notesResponse = await fetch(`/api/notes?userId=${userData.id}`, {
				headers: {
					'Authorization': `Bearer ${$authToken}`
				}
			});

			if (!notesResponse.ok) {
				const error = await notesResponse.json();
				showNotification(error.error || 'Failed to fetch notes', 'error');
				return;
			}

			const data = await notesResponse.json();
			notes = Array.isArray(data) ? data : [];
			if (notes.length > 0 && !selectedNote) {
				selectedNote = notes[0];
			}
		} catch (error) {
			showNotification('Failed to fetch notes', 'error');
			console.error('Fetch Error:', error);
		}
	}

	async function deleteNote(id) {
		if (confirm('Are you sure you want to delete this note?')) {
			try {
				const response = await fetch('/api/notes', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${$authToken}`
					},
					body: JSON.stringify({ id })
				});

				if (!response.ok) {
					throw new Error('Failed to delete note');
				}

				showNotification('Note deleted successfully');
				await fetchNotes();
				if (selectedNote?.id === id) {
					selectedNote = notes[0] || null;
				}
			} catch (error) {
				showNotification('Failed to delete note', 'error');
			}
		}
	}

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function showNotification(message, type = 'success') {
		toastMessage = message;
		toastType = type;
		showToast = true;
		setTimeout(() => (showToast = false), 3000);
	}
</script>

<div class="flex h-[calc(100vh-64px)]">
	<!-- Sidebar with improved styling -->
	<div class="flex w-96 flex-col border-r border-zinc-800 bg-zinc-900">
		<div class="space-y-4 border-b border-zinc-800 p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-white">All Notes ({notes.length})</h2>
				<a
					href="/notes/new"
					class="inline-flex items-center rounded bg-white px-3 py-1.5 text-sm text-black transition-colors hover:bg-gray-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					New
				</a>
			</div>
			<div class="relative">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search notes..."
					class="w-full rounded-lg border border-zinc-800 bg-black p-2 pl-8 text-sm text-white placeholder-gray-500 transition-colors focus:border-white"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="absolute top-3 left-2.5 h-4 w-4 text-gray-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>

		{#if loading}
			<div class="flex flex-1 items-center justify-center">
				<LoadingSpinner />
			</div>
		{:else}
			<div class="flex-1 overflow-y-auto">
				{#each filteredNotes as note}
					<button
						class="w-full border-b border-zinc-800 p-4 text-left transition-colors hover:bg-zinc-800 {selectedNote?.id ===
						note.id
							? 'border-l-2 border-l-white bg-zinc-800'
							: ''}"
						onclick={() => (selectedNote = note)}
					>
						<h3 class="truncate font-semibold text-white">{note.title}</h3>
						<p class="mt-1 truncate text-sm text-gray-400">{note.content}</p>
						<div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
							<span>{formatDate(note.created_at)}</span>
							<span>•</span>
							<span>{note.content.length} characters</span>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Main Content with improved layout -->
	<div class="flex flex-1 flex-col bg-black">
		{#if selectedNote}
			<div class="flex-1 overflow-y-auto p-8">
				<div class="mx-auto max-w-3xl">
					<div class="mb-6 flex items-center justify-between">
						<div>
							<h2 class="mb-2 text-3xl font-bold text-white">{selectedNote.title}</h2>
							<p class="text-sm text-gray-400">
								Created on {formatDate(selectedNote.created_at)}
							</p>
						</div>
						<div class="flex gap-2">
							<a
								href="/notes/{selectedNote.id}/edit"
								class="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-1.5 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								Edit
							</a>
							<button
								onclick={() => deleteNote(selectedNote.id)}
								class="inline-flex items-center rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-1.5 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete
							</button>
						</div>
					</div>
					<div class="prose prose-invert prose-lg max-w-none">
						{selectedNote.content}
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-1 items-center justify-center text-gray-500">
				<div class="text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mx-auto mb-4 h-16 w-16 text-gray-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h3 class="mb-2 text-xl font-semibold">No Note Selected</h3>
					<p class="text-gray-600">Select a note from the sidebar or create a new one</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<Toast show={showToast} message={toastMessage} type={toastType} />
