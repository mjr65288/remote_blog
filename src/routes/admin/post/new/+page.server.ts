import { auth } from '$lib/auth';
import { form } from '$lib/server/actions/actions';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import * as v from 'valibot';

// export async function load() {
// 	const posts = await db.query.post.findMany();

// 	return {posts};
// }

export const actions = {
	// Wrap your action using our new form utility
	create_post: form(
		v.object({
			title: v.pipe(v.string(), v.nonEmpty('Title is required')),
			body: v.pipe(v.string(), v.nonEmpty('Body is required'))
		}),
		async ({ title, body }, event) => {
			// Auth check using the event wrapper passed from our utility
			const session = await auth.api.getSession({
				headers: event.request.headers
			});

			if (!session?.user?.id) {
				error(401, 'Unauthorized');
			}

			// URL-friendly slug generator
			const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

			// Insert into your Drizzle database
			await db.insert(post).values({
				title,
				slug,
				body,
				authorId: session.user.id
			});

			// Redirect back to admin list
			throw redirect(303, '/admin');
		}
	)
};