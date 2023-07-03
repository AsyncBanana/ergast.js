export default class APICache {
	ttl: number;
	#cache: Promise<Cache> | undefined;
	constructor(ttl: number) {
		this.ttl = ttl;
		if (ttl === 0) return;
		if (globalThis.caches?.open) this.#cache = caches.open(`ergast.js:${ttl}`);
		// Node.js not currently supported
	}
	async get(url: string): Promise<Response | void> {
		if (!this.#cache) return;
		const cache = await this.#cache;
		const res = await cache.match(url);
		if (!res) return;
		if (Date.now() - Date.parse(res.headers.get("x-date")) <= this.ttl * 1000)
			return res;
		await cache.delete(url);
	}
	async set(url: string, response: Response) {
		if (!this.#cache) return;
		const cache = await this.#cache;
		cache.delete(url);
		await cache.put(
			url,
			new Response(response.clone().body, {
				headers: {
					"x-date": new Date().toISOString(),
				},
			}),
		);
		return response;
	}
	// rome-ignore lint/suspicious/noExplicitAny: Cannot set explicit type
	async fetch(url: string): Promise<Record<string, any>> {
		if (!this.#cache) return await (await fetch(url)).json();
		let res = await this.get(url);
		if (!res) {
			res = await this.set(url, await fetch(url));
		}
		return await res.json();
	}
}
