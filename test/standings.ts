import assert from "node:assert";
import Ergast from "../src/index.js";
import test from "node:test";

const api = new Ergast({});

// TODO implement actual tests here
test("Get driver standings", async () => {
	await api.standings.getDriverStandings(2023);
});
test("Get constructor standings", async () => {
	await api.standings.getConstructorStandings(2023);
});
