<div align="center">

![Ergast.js logo](Ergast.js.svg)

![MIT License Badge](https://img.shields.io/npm/l/ergast?style=for-the-badge) ![Zero Dependencies Badge](https://img.shields.io/badge/Dependencies-0-darkgreen?style=for-the-badge)
![Compressed package size](https://img.shields.io/bundlephobia/minzip/ergast?style=for-the-badge) ![NPM Version](https://img.shields.io/npm/v/ergast?style=for-the-badge)

**Currently unstable and incomplete; Not all data APIs are available**

Ergast.js is a simple, portable, zero dependency API wrapper for the F1 API [Ergast](http://ergast.com/mrd/). It can be run on Node.js, the browser, or almost anywhere else JavaScript can be run, and is written entirely in TypeScript.

</div>

## Features

- 🪶 Lightweight, with zero dependencies
- 📦 Built in caching for web runtimes (Node.js coming soon) using the Cachestorage API.
- 🌎 Supports Deno, Node, the web, and even service workers. Also comes with built-in Typescript types
- 🔰 Very easy to use, batteries included API
- 📅 Automatically transforms properties like dates into their native JavaScript datatype

## Get started

First, install Ergast.js using your respective package manager.

```sh
npm install ergast
```

Then, import it and instantiate a new class using the default import

```js
import Ergast from "ergast";
const F1Data = new Ergast();
```

If you want, you can also set a default season and round by passing `season` and `round` as properties in the configuration object. If you do not set them, they will default to the current year and every round that year. You can also specify the TTL (time-to-live) of the cache by passing a `ttl` property with the number of seconds (however, note that the cache currently does not work in Node.js). It defaults to 30 minutes.

```js
import Ergast from "ergast";
const F1Data = new Ergast({
  season: 2023, // Once again, completely optional
  round: 2,
  ttl: 18000,
});
```

You can also pass the season and round as arguments to individual functions to override the defaults.

Now, you can start using the API. The API itself is rather simple and is documented through the TypeScript types bundled with the library by default. For example, if you wanted to get information about a certain driver, you would use this:

```js
const driverData = await F1Data.drivers.get(
  /*driver id, normally their last name*/ "albon"
);
console.log(driverData);
/*
{
	driverId: "albon",
	permanentNumber: 23,
	code: "ALB",
	url: "http://en.wikipedia.org/wiki/Alexander_Albon",
	givenName: "Alexander",
	familyName: "Albon",
	dateOfBirth: 1996-03-23T00:00:00.000Z,
	nationality: "Thai",
}
*/
```

As another example, if you want to get the results of a race, just run this:

```js
const raceData = await F1Data.races.get(2023,1)
console.log(raceData)
/*
[
  {
    season: 2023,
    round: 1,
    url: "https://en.wikipedia.org/wiki/2023_Bahrain_Grand_Prix",
    raceName: "Bahrain Grand Prix",
    Circuit: {
      circuitId: "bahrain",
      url: "http://en.wikipedia.org/wiki/Bahrain_International_Circuit",
      circuitName: "Bahrain International Circuit",
      Location: // Truncated
    },
    date: "2023-03-05",
    time: "15:00:00Z",
    Results: [
      // Truncated
    ],
    dateTime: 2023-03-05T15:00:00.000Z,
  }
]
```

Once again, to find information on all currently available API methods, simply look at the type declaration files. Most modern IDEs also show available methods and the attached annotations automatically.

## Contributing

To learn how to contribute, check out the [contribution page](https://github.com/AsyncBanana/ergast.js/blob/main/CONTRIBUTING.md)
