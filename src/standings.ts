import type { Constructor } from "./constructors.js";
import { SubClass } from "./core.js";
import { _transformDriver, type Driver, type _BaseDriver } from "./drivers.js";
export interface _BaseConstructorStanding {
	position: string;
	positionText: string;
	points: string;
	wins: string;
	Constructor: Constructor;
}
export interface _BaseDriverStanding {
	position: string;
	positionText: string;
	points: string;
	wins: string;
	Constructors: Constructor[];
	Driver: _BaseDriver;
}
/**
 * Information describing a constructor's position in a given round or year
 */
export interface ConstructorStanding {
	position: number;
	positionText: string;
	points: number;
	wins: number;
	Constructor: Constructor;
}
/**
 * Information describing a driver's position in a given round or year
 */
export interface DriverStanding {
	position: number;
	positionText: string;
	points: number;
	wins: number;
	Constructors: Constructor[];
	Driver: Driver;
}
function _transformConstructorStanding(
	standing: _BaseConstructorStanding,
): ConstructorStanding {
	return {
		...standing,
		position: +standing.position,
		points: +standing.points,
		wins: +standing.wins,
	};
}
function _transformDriverStanding(
	standing: _BaseDriverStanding,
): DriverStanding {
	return {
		...standing,
		position: +standing.position,
		points: +standing.points,
		wins: +standing.wins,
		Driver: _transformDriver(standing.Driver),
	};
}
export default class Standings extends SubClass {
	/**
	 * Get the driver standings for a given year
	 * @param year The year of the season
	 * @param round The round of to get standings from. Defaults to the whole year.
	 * @returns Standings
	 */
	async getDriverStandings(
		year: number | "current" = this.season,
		round: number = this.round,
	): Promise<DriverStanding[]> {
		const res = (
			await this.cache.fetch(
				`${this.endpoint}/${year || "current"}${
					round ? `/${round}` : ""
				}/driverStandings.json`,
			)
		).MRData;
		if (res.total < 1) {
			throw new Error("No standings found");
		}
		const data: _BaseDriverStanding[] =
			res.StandingsTable.StandingsLists[0].DriverStandings;
		return data.map(_transformDriverStanding);
	}
	/**
	 * Get the driver standings for a given year
	 * @param year The year of the season
	 * @param round The round of to get standings from. Defaults to the whole year.
	 * @returns Standings
	 */
	async getConstructorStandings(
		year: number | "current" = this.season,
		round: number = this.round,
	): Promise<ConstructorStanding[]> {
		const res = (
			await this.cache.fetch(
				`${this.endpoint}/${year || "current"}${
					round ? `/${round}` : ""
				}/constructorStandings.json`,
			)
		).MRData;
		if (res.total < 1) {
			throw new Error("No standings found");
		}
		const data: _BaseConstructorStanding[] =
			res.StandingsTable.StandingsLists[0].ConstructorStandings;
		return data.map(_transformConstructorStanding);
	}
}
