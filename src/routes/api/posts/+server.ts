import { db } from '$lib/server/db';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET = async ({ locals, url }) => {
	const posts = await db.query.post.findMany();

	return json(posts);
};
