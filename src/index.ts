import Core from "./core.js";
import Drivers from "./drivers.js";
import type { Options } from "./core.js";
import APICache from "./cache.js";
import Races from "./races.js";
/**
 * Main class; contains all API methods
 */
export default class ErgastAPI extends Core {
	#getArgs() {
		return {
			season: this.season,
			ttl: this.ttl,
			round: this.round,
			endpoint: this.endpoint,
			_cache: this.cache,
		};
	}
	constructor(Config: Options = {}) {
		const {
			season = "current",
			round,
			ttl = 120,
			endpoint = "https://ergast.com/api/f1",
		} = Config;
		super({
			season,
			round,
			ttl,
			endpoint,
		});
		this.cache = new APICache(ttl);
	}
	readonly drivers = new Drivers(this.#getArgs());
	readonly races = new Races(this.#getArgs());
}
