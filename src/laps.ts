/**
 * Information about a lap for a specific driver in a race
 */
export interface Lap {
	rank: number;
	lap: number;
	time: string;
	averageSpeed: {
		units: string;
		speed: number;
	};
}
/**
 * @internal
 * Ergast's representation of a lap
 */
export interface _BaseLap {
	rank: string;
	lap: string;
	time: string;
	AverageSpeed: {
		units: string;
		speed: string;
	};
}
/**
 * Transforms a lap object from Ergast's response to a more idiomatic version; Not designed for consumption;
 * @internal
 * @param lap Ergast lap object
 * @returns Transformed lap object
 */
export function _transformLap(lap: _BaseLap): Lap {
	return {
		...lap,
		rank: +lap.rank,
		lap: +lap.lap,
		averageSpeed: {
			...lap.AverageSpeed,
			speed: +lap.AverageSpeed.speed,
		},
	};
}
