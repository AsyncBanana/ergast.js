import APICache from "./cache.js";

export interface Config {
	/**
	 * Default year for API requests. Defaults to the current year
	 */
	season: number | "current";
	/**
	 * Default round for API requests. Defaults to nothing (the whole year)
	 */
	round?: number;
	/**
	 * Cache TTL. Currently unused
	 */
	ttl: number;
	/**
	 * API endpoint. Defaults https://ergast.com/api/f1
	 */
	endpoint: string;
}
export interface CacheConfig extends Config {
	_cache: APICache;
}
/**
 * Options passed into the config
 */
export type Options = Partial<Config>;
export type CacheOptions = Partial<CacheConfig>;
/**
 * Base class for API implementations and the main class
 */
export default class Core implements Config {
	protected cache: APICache;
	season: number | "current";
	round?: number;
	ttl: number;
	endpoint: string;
	constructor({
		season = "current",
		round,
		ttl = 120,
		endpoint = "https://ergast.com/api/f1",
	}: Options) {
		this.season = season;
		this.round = round;
		this.ttl = ttl;
		this.endpoint = endpoint;
	}
}
export class SubClass extends Core {
	constructor({
		season = "current",
		round,
		ttl = 120,
		endpoint = "https://ergast.com/api/f1",
		_cache,
	}: CacheOptions) {
		super({
			season,
			round,
			ttl,
			endpoint,
		});
		if (_cache) {
			this.cache = _cache;
		} else {
			this.cache = new APICache(ttl);
		}
	}
}
