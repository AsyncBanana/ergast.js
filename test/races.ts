import assert from "node:assert";
import Ergast from "../src/index.js";
import test from "node:test";

const api = new Ergast({});
// TODO implement actual tests here
test("Get race results", async () => {
	await api.races.get(2023, 1);
});
test("Get race schedule", async () => {
	await api.races.getSchedule(2023);
});
test("Get season results", async () => {
	await api.races.getAll(2023);
});
