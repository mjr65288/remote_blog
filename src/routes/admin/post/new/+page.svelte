<script lang="ts">
	import { enhance } from '$app/forms';

	// 1. This grabs any validation errors or success data returned by your server helper
	let { form } = $props();
</script>

<div class="admin-container">
	<h1>Create a New Post</h1>

    <!-- <form method="POST" action="/api/admin/post/new?/create_post" use:enhance> see -->
	<form method="POST" action="?/create_post" use:enhance>
		
		{#if form?.success === false && form?.errors}
			<div class="error-banner">
				<ul>
					{#each form.errors as error}
						<li>{error}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<label>
			<span>Title</span>
			<input type="text" name="title" placeholder="My Awesome Blog Post" />
		</label>

		<label>
			<span>Body Content</span>
			<textarea name="body" rows="10" placeholder="Write something incredible..."></textarea>
		</label>

		<button type="submit">Publish Post</button>
	</form>
</div>

<style>
	.admin-container {
		max-width: 40rem;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-weight: bold;
	}

	input, textarea {
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	button {
		padding: 0.75rem;
		background-color: #ff3e00; /* Svelte Orange! */
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}

	button:hover {
		background-color: #e03700;
	}

	.error-banner {
		background-color: #fce8e6;
		color: #c5221f;
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid #fad2cf;
	}
</style>