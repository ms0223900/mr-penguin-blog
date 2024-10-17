/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function handleOptions(request) {
    if (request.headers.get("Origin") !== null && request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null) {
        return new Response(null, {
            headers: corsHeaders,
        });
    } else {
        return new Response(null, {
            headers: {
                Allow: "GET, OPTIONS",
            },
        });
    }
}
export default {
    async fetch(request, env, ctx) {
        try {
            if (request.method === "OPTIONS") {
                return handleOptions(request);
            }

            if (request.method === "GET") {
                const value = await env.KV_TODO.get("todos");
                return new Response(value);
            }

            if (request.method === "POST") {
                const reqBody = await request.text();
                if (!reqBody) {
                    return new Response("No request body", { status: 400 });
                }
                const body = JSON.parse(reqBody);
                const prevTodos = await env.KV_TODO.get("todos");
                const value = await env.KV_TODO.put("todos", JSON.stringify([
                    ...(prevTodos ? JSON.parse(prevTodos) : []),
                    body,
                ]));
                return new Response(value);
            }

            return new Response("OK");
        } catch (error) {

        }
    },
};