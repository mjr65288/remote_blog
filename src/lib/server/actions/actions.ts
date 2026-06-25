import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { error, fail, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot'; // Assuming Valibot based on your syntax

export function form<T extends v.BaseSchema<any, any, any>>(
	schema: T,
	actionLogic: (data: v.InferOutput<T>, event: RequestEvent) => Promise<any>
) {
	// This returns a standard SvelteKit action function
	return async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const rawData = Object.fromEntries(formData.entries());

		// 1. Automatically run the validation check
		const result = v.safeParse(schema, rawData);

		// If validation fails, automatically tell the frontend what went wrong
		if (!result.success) {
			return fail(400, {
				success: false,
				errors: result.issues.map(i => i.message)
			});
		}

		// 2. If validation passes, run your custom database logic
		// We pass the clean validated data AND the SvelteKit event info
		return await actionLogic(result.output, event);
	};
}

export async function getPostById(id: string) {
	const result = await db.query.post.findFirst({
		where: eq(post.id, id)
	});

	if (!result) {
		error(404, 'Post not found');
	}

	return result;
}
