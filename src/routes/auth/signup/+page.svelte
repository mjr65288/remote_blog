<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	let error = $state('');

	async function signup(e: Event) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const data = new FormData(form);
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		if (!name || !email || !password || !confirmPassword) {
			alert('Please fill in all fields');
			return;
		}

		await authClient.signUp.email(
			{ name, email, password },
			{
				onSuccess: () => {
					goto(resolve('/'));
				},
				onError: (ctx) => {
					console.error(ctx.error);
					error = ctx.error.message;
				}
			}
		);
	}
</script>

<div class="box-1">
	<h1>Sign Up</h1>
	<form onsubmit={signup}>
		<div class="row">
			<label
				>Name:
				<input required type="text" name="name" id="name" />
			</label>
		</div>
		<div class="row">
			<label
				>Email:
				<input required type="email" name="email" id="email" />
			</label>
		</div>
		<div class="row">
			<label
				>Password:
				<input required type="password" name="password" id="password" />
			</label>
		</div>
		<div class="row">
			<label
				>Confirm Password:
				<input required type="password" name="confirmPassword" id="confirmPassword" />
			</label>
		</div>
		{#if error}
			<div style="color: red;">{error}</div>
		{/if}
		<button type="submit">Sign Up</button>
	</form>
</div>
