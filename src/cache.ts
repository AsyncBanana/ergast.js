type TTLCache =
	| {
			[key: string]: TTLCache;
	  }
	| number;
const richTypes = { Date: true, RegExp: true, String: true, Number: true };
export default class APICache {
	ttl: number;
	#cache: Record<string, unknown>;
	#ttlCache: TTLCache = {};
	#ttlKey: symbol;
	constructor(ttl: number) {
		this.ttl = ttl;
		this.#cache = Object.create(null);
		this.#ttlKey = Symbol();
	}
	get(path: string[]): unknown | Promise<unknown> | undefined {
		const res = path.reduce(
			(cacheEl, pathEl) => cacheEl?.[pathEl],
			this.#cache
		);
		if (this.ttl < 0) {
			const ttlRes: TTLCache = path.reduce(
				(cacheEl, pathEl) => cacheEl?.[pathEl],
				this.#ttlCache
			);
			if (!this.#checkTTL(res, ttlRes)) {
				return undefined;
			}
		}
		return res;
	}
	set(path: string[], value: unknown) {
		const lastPath = path.pop();
		const res = path.reduce((cacheEl, pathEl) => {
			if (!cacheEl?.[pathEl]) {
				cacheEl[pathEl] = {};
			}
			return cacheEl[pathEl];
		}, this.#cache);
		if (this.ttl < 0) {
			const ttlRes: TTLCache = path.reduce((cacheEl, pathEl) => {
				if (cacheEl?.[pathEl]) {
					return cacheEl[pathEl];
				}
				cacheEl[pathEl] = {};
				return cacheEl[pathEl];
			}, this.#ttlCache);
			this.#setTTL(ttlRes, lastPath, value);
		}
		res[lastPath] = value;
	}
	#setTTL(ttlRes: TTLCache, lastPath: string, value: unknown) {
		if (
			typeof value === "object" &&
			richTypes[Object.getPrototypeOf(value)?.constructor?.name]
		) {
			ttlRes[lastPath] = performance.now();
			return;
		}
		Object.keys(value).forEach((key) => {
			if (!ttlRes[lastPath]) ttlRes[lastPath] = {};
			this.#setTTL(ttlRes[lastPath], key, value[key]);
		});
	}
	#checkTTL(obj, ttlObj?: TTLCache) {
		for (const property in obj) {
			if (
				typeof property[obj] === "object" &&
				richTypes[
					Object.getPrototypeOf(property[obj])?.constructor?.name
				]
			) {
				if (
					ttlObj[property] +
						this.ttl * 1e3 /* millisecond to second */ <
					performance.now()
				) {
					// object is outdated
					return false;
				}
				if (!this.#checkTTL(obj[property], ttlObj[property])) {
					// property is an object/array
					return false;
				}
			}
		}
		return true;
	}
}
