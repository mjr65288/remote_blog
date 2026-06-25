<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Edit {data.post.title}</title>
</svelte:head>

<div class="admin-container">
	<a class="back-link" href={resolve('/admin')}>Back to posts</a>

	<h1>Edit Post</h1>

	<form method="POST" action="?/update_post" use:enhance>
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
			<input type="text" name="title" value={data.post.title} />
		</label>

		<label>
			<span>Body Content</span>
			<textarea name="body" rows="10">{data.post.body}</textarea>
		</label>

		<button type="submit">Update Post</button>
	</form>
</div>

<style>
	.admin-container {
		max-width: 40rem;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 1rem;
		color: inherit;
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
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

	input,
	textarea {
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	button {
		padding: 0.75rem;
		background-color: #ff3e00;
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
