import { Constructor } from "./constructors.js";
import { SubClass } from "./core.js";
import { _transformDriver, type Driver, type _BaseDriver } from "./drivers.js";
import { Lap, _BaseLap, _transformLap } from "./laps.js";
/**
 * Driver placement
 */
export interface Result {
	number: number;
	position: number;
	positionText: string;
	points: number;
	Driver: Driver;
	Constructor: Constructor;
	grid: number;
	laps: number;
	status: string;
	Time: {
		millis: number;
		time: string;
	};
	FastestLap: Lap;
}
/**
 * @internal
 * Ergast's representation of a race result
 */
export interface _BaseResult {
	number: string;
	position: string;
	positionText: string;
	points: string;
	Driver: _BaseDriver;
	Constructor: Constructor;
	grid: string;
	laps: string;
	status: string;
	Time: {
		millis: string;
		time: string;
	};
	FastestLap: _BaseLap;
}

export interface ScheduledRace {
	season: number;
	round: number;
	url: string;
	raceName: string;
	Circuit: {
		circuitId: string;
		url: string;
		circuitName: string;
		Location: {
			lat: string;
			long: string;
			locality: string;
			country: string;
		};
	};
	dateTime: Date;
}
/**
 * Information about the race; slightly changed from Ergast's data to take advantage of JavaScript's datatypes
 */
export interface Race extends ScheduledRace {
	Results: Result[];
}

interface _BaseScheduledRace {
	season: string;
	round: string;
	url: string;
	raceName: string;
	Circuit: {
		circuitId: string;
		url: string;
		circuitName: string;
		Location: {
			lat: string;
			long: string;
			locality: string;
			country: string;
		};
	};
	date: string;
	time: string;
}

/**
 * @internal
 * Ergast's representation of a race
 */
export interface _BaseRace extends _BaseScheduledRace {
	Results: _BaseResult[];
}

function _transformResult(result: _BaseResult): Result {
	return {
		...result,
		number: +result.number,
		position: +result.position,
		points: +result.points,
		Driver: _transformDriver(result.Driver),
		grid: +result.grid,
		laps: +result.laps,
		Time: {
			...result.Time,
			millis: +result.Time,
		},
		FastestLap: _transformLap(result.FastestLap),
	};
}
function _transformRace(race: _BaseRace): Race {
	return {
		...race,
		season: +race.season,
		round: +race.round,
		dateTime: new Date(`${race.date}T${race.time}`),
		Results: race.Results.map(_transformResult),
	};
}
function _transformScheduledRace(race: _BaseScheduledRace): ScheduledRace {
	return {
		...race,
		season: +race.season,
		round: +race.round,
		dateTime: new Date(`${race.date}T${race.time}`),
	};
}
/**
 * All race related API methods
 */
export default class Races extends SubClass {
	/**
	 * Get the schedule for the specified year
	 * @param season Year of schedule
	 * @returns Race schedule
	 */
	async getSchedule(
		season: number | "current" = this.season,
	): Promise<ScheduledRace[]> {
		const res = (
			await this.cache.fetch(`${this.endpoint}/${season}.json?limit=999`)
		).MRData;
		if (res.total < 1) {
			throw new Error("No races found");
		}
		const data: _BaseScheduledRace[] = res.RaceTable.Races;
		return data.map(_transformScheduledRace);
	}
	/**
	 * Get results for a specific race
	 * @param season Year of race
	 * @param round Race round number
	 * @returns Race results
	 */
	async get(
		season: number | "current" = this.season,
		round: number = this.round,
	): Promise<Race> {
		const res = (
			await this.cache.fetch(
				`${this.endpoint}/${season}/${
					round || "latest"
				}/results.json?limit=999`,
			)
		).MRData;
		if (res.total < 1) {
			throw new Error("No races found");
		}
		const data: _BaseRace = res.RaceTable.Races[0];
		return _transformRace(data);
	}
	/**
	 * Get results for all races in a season
	 * @param season Season year
	 * @returns Race results
	 */
	async getAll(season: number | "current" = this.season): Promise<Race[]> {
		const res = (
			await this.cache.fetch(
				`${this.endpoint}/${season}/results.json?limit=999`,
			)
		).MRData;
		if (res.total < 1) {
			throw new Error("No races found");
		}
		const data: _BaseRace[] = res.RaceTable.Races;
		return data.map(_transformRace);
	}
}
