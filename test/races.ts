import assert from "node:assert";
import Ergast from "../src/index.js";
import test from "node:test";

const api = new Ergast({});
console.error(JSON.stringify(await api.races.get(2023, 5)));
test("Get race results", async () => {
	// TODO implement actual tests here
	await api.races.get(2023, 1);
});
test("Get race schedule", async () => {
	// TODO implement actual tests here
	await api.races.getSchedule(2023);
});
