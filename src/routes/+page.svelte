<script>
  import { fade, fly } from 'svelte/transition';
  import { authToken } from '$lib/stores/auth';
</script>

<main class="min-h-screen bg-black text-white">
  <!-- Hero Section -->
  <div class="container mx-auto px-4 py-20">
    <div class="text-center max-w-4xl mx-auto" in:fade={{ duration: 1000 }}>
      <h1 class="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-zinc-500">
        NotesFlow
      </h1>
      <p class="text-2xl text-gray-300 mb-12 leading-relaxed">
        Your thoughts, beautifully organized. Simple, fast, and elegant note-taking.
      </p>
      <div class="flex gap-4 justify-center mb-16">
        {#if $authToken}
          <a 
            href="/notes" 
            class="bg-white text-black hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
          >
            My Notes
          </a>
          <a 
            href="/notes/new" 
            class="bg-transparent border border-white text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black"
          >
            Create Note
          </a>
        {:else}
          <a 
            href="/login" 
            class="bg-white text-black hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
          >
            Login
          </a>
          <a 
            href="/signup" 
            class="bg-transparent border border-white text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black"
          >
            Sign Up
          </a>
        {/if}
      </div>
    </div>

    <!-- Features Section -->
    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" in:fly={{ y: 50, duration: 1000, delay: 300 }}>
      <div class="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-white transition-colors">
        <div class="text-4xl mb-4">⚡️</div>
        <h3 class="text-xl font-bold mb-3">Lightning Fast</h3>
        <p class="text-gray-400">Create and access your notes instantly with our streamlined interface.</p>
      </div>

      <div class="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-white transition-colors">
        <div class="text-4xl mb-4">🎯</div>
        <h3 class="text-xl font-bold mb-3">Stay Focused</h3>
        <p class="text-gray-400">Clean, distraction-free writing environment for your best work.</p>
      </div>

      <div class="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-white transition-colors">
        <div class="text-4xl mb-4">🔒</div>
        <h3 class="text-xl font-bold mb-3">Secure Storage</h3>
        <p class="text-gray-400">Your notes are safely stored and always accessible when you need them.</p>
      </div>
    </div>
  </div>

  <!-- Bottom CTA -->
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-6">Start Taking Better Notes Today</h2>
      <p class="text-gray-400 mb-8 text-lg">
        Join thousands of users who have already transformed their note-taking experience.
      </p>
      <a 
        href="/signup" 
        class="inline-flex items-center bg-white text-black hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        Get Started
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </a>
    </div>
  </div>
</main>

<style>
  .hover\:shadow-glow:hover {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
</style>