<script lang="ts">
	import { resolve } from '$app/paths';

    let {data} = $props();
    console.log('data', data.posts);

</script>

<a class="button" href={resolve('/admin/post/new')}>New Post</a>

<ol>
{#each data.posts as post (post.id)}
		<li>
			<a href={resolve(`/admin/post/${post.id}`)}>{post.title}</a>
		</li>
	{/each}
	
</ol>