import Core from "./core.js";
import Drivers, { type Driver } from "./drivers.js";
import type { Options } from "./core.js";
import APICache from "./cache.js";
import Races, { type ScheduledRace, type Result, type Race } from "./races.js";
import Standings, {
	type ConstructorStanding,
	type DriverStanding,
} from "./standings.js";
import { type Lap } from "./laps.js";
import { type Constructor } from "./constructors.js";
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
			ttl = 1800, // 30 minutes
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
	readonly standings = new Standings(this.#getArgs());
}
export {
	Driver,
	ScheduledRace,
	Result,
	Lap,
	Constructor,
	ConstructorStanding,
	DriverStanding,
	Race,
};
