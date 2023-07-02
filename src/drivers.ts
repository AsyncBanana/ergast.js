import { SubClass } from "./core.js";
export interface Driver {
	driverId: string;
	permanentNumber: number;
	code: string;
	url: string;
	givenName: string;
	familyName: string;
	dateOfBirth: Date;
	nationality: string;
}
export interface _BaseDriver {
	driverId: string;
	permanentNumber: string;
	code: string;
	url: string;
	givenName: string;
	familyName: string;
	dateOfBirth: string;
	nationality: string;
}
/**
 * Transforms a driver object from Ergast's response to a more idiomatic version; Not designed for consumption;
 * @internal
 * @param driver Ergast driver object
 * @returns Transformed driver object
 */
export function _transformDriver(driver: _BaseDriver): Driver {
	return {
		...driver,
		dateOfBirth: new Date(driver.dateOfBirth),
		permanentNumber: +driver.permanentNumber,
	};
}
export default class Drivers extends SubClass {
	/**
	 * Get information about a driver
	 * @param driverId id of driver (generally their last name all lowercase)
	 * @returns Driver data
	 */
	async get(driverId: string): Promise<Driver | undefined> {
		const res = (
			await (await fetch(`${this.endpoint}/drivers/${driverId}.json`)).json()
		).MRData;
		if (res.total < 1) {
			throw new Error("No driver found");
		}
		const data: _BaseDriver = res.DriverTable.Drivers[0];
		return _transformDriver(data);
	}
	/**
	 * Get list of drivers for a year or round
	 * @param year
	 * @param round
	 * @returns Array of drivers for the specified period
	 */
	async getAll(
		year: number | "current" = this.season,
		round: number = this.round,
	): Promise<Driver[] | undefined> {
		const res = (
			await (
				await fetch(
					`${this.endpoint}${year ? `/${year}` : ""}${
						round ? `/${round}` : ""
					}/drivers.json`,
				)
			).json()
		).MRData;
		if (res.total < 1) {
			throw new Error("No drivers found");
		}
		return res.DriverTable.Drivers.map(_transformDriver);
	}
}
