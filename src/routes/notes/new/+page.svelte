<script lang="ts">
	import Toast from '$lib/components/Toast.svelte';
	import { authToken } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let title: string = $state('');
	let content: string = $state('');
	let showToast: boolean = $state(false);
	let toastMessage: string = $state('');
	let toastType: string = $state('success');
	let charCount = $state(0);
	let wordCount = $state(0);
	let isFullscreen = $state(false);

	// Auto-save draft to localStorage
	const DRAFT_KEY = 'note_draft';

	let autoSaveInterval: number | null | undefined;

	$effect(() => {
		charCount = content.length;
		wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

		const draft = localStorage.getItem(DRAFT_KEY);
		if (draft) {
			const { title: draftTitle, content: draftContent } = JSON.parse(draft);
			title = draftTitle;
			content = draftContent;
		}

		autoSaveInterval = setInterval(saveDraft, 5000);
		return () => clearInterval(autoSaveInterval);
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!title.trim() || !content.trim()) {
			showNotification('Please fill in all fields', 'error');
			return;
		}

		try {
			// First, get the user data from the token
			const userResponse = await fetch('/api/auth/user', {
				headers: {
					Authorization: `Bearer ${$authToken}`
				}
			});

			if (!userResponse.ok) {
				throw new Error('Failed to authenticate user');
			}

			const userData = await userResponse.json();

			// Then create the note with the user ID
			const response = await fetch('/api/notes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$authToken}`
				},
				body: JSON.stringify({
					title,
					content,
					userId: userData.id
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to save note');
			}

			showNotification('Note saved successfully!');
			localStorage.removeItem(DRAFT_KEY); // Clear draft after successful save
			setTimeout(() => {
				goto('/notes');
			}, 1000);
		} catch (error) {
			showNotification(error.message || 'Failed to save note', 'error');
		}
	}

	function showNotification(message = 'message', type = 'success') {
		toastMessage = message;
		toastType = type;
		showToast = true;
		setTimeout(() => (showToast = false), 3000);
	}

	function toggleFullscreen() {
		isFullscreen = !isFullscreen;
	}

	function saveDraft() {
		localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content }));
	}
</script>

<div class="mx-auto max-w-4xl p-6 {isFullscreen ? 'fixed inset-0 z-50 max-w-none bg-black' : ''}">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-white">Create Note</h1>
		<div class="flex items-center gap-4">
			<button onclick={toggleFullscreen} class="text-gray-400 transition-colors hover:text-white">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					{#if isFullscreen}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
						/>
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
						/>
					{/if}
				</svg>
			</button>
			<a
				href="/notes"
				class="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Notes
			</a>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<div class="rounded-lg bg-zinc-900 p-6">
			<input
				type="text"
				bind:value={title}
				placeholder="Note title"
				class="w-full border-b border-zinc-800 bg-transparent p-3 text-xl font-semibold placeholder-gray-500 transition-colors outline-none focus:border-white"
				required
			/>
			<textarea
				bind:value={content}
				placeholder="Start writing your note..."
				class="mt-6 h-[calc(100vh-350px)] w-full resize-none bg-transparent p-3 placeholder-gray-500 outline-none"
				required
			></textarea>
			<div class="mt-4 flex items-center justify-between text-sm text-gray-500">
				<div class="flex gap-4">
					<span>{charCount} characters</span>
					<span>{wordCount} words</span>
				</div>
				<span class="text-gray-600">Auto-saving draft...</span>
			</div>
		</div>
		<div class="flex justify-end gap-4">
			<a
				href="/notes"
				class="rounded-lg border border-zinc-700 px-6 py-3 text-gray-300 transition-colors hover:border-white hover:text-white"
			>
				Cancel
			</a>
			<button
				type="submit"
				class="rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100"
			>
				Save Note
			</button>
		</div>
	</form>
</div>

<Toast show={showToast} message={toastMessage} type={toastType} />
