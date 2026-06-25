import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
    console.log('locals.user', locals.user);
    if (locals.user?.id) {
        throw redirect(302, '/');
    }
}