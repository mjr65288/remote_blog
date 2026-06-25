import { auth } from '$lib/auth';
import { form, getPostById } from '$lib/server/actions/actions';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

export async function load({ params }) {
	const post = await getPostById(params.id);

	return { post };
}

export const actions = {
	update_post: form(
		v.object({
			title: v.pipe(v.string(), v.nonEmpty('Title is required')),
			body: v.pipe(v.string(), v.nonEmpty('Body is required'))
		}),
		async ({ title, body }, event) => {
			const id = event.params.id;

			if (!id) {
				error(400, 'Missing post id');
			}

			const session = await auth.api.getSession({
				headers: event.request.headers
			});

			if (!session?.user?.id) {
				error(401, 'Unauthorized');
			}

			const slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');

			await db
				.update(post)
				.set({
					title,
					slug,
					body,
					updatedAt: new Date()
				})
				.where(eq(post.id, id));

			throw redirect(303, '/admin');
		}
	)
};
