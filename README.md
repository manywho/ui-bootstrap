# ManyWho UI Bootstrap

[Bootstrap](https://getbootstrap.com) implementation of the various UI components used by the [ManyWho](https://manywho.com) UI framework.

## Usage

### Building

To build the ui bootstrap components you will need to have [nodejs](http://nodejs.org/) installed.

Then install dependencies:

```
npm install
```

Then run the dev build:

```
npm run dev
```

Or dist build:

```
npm run dist
```

### Running

You can run:

```
npm start
```

Which will rebuild the project whenever a change to the script or less files is made.

By default the compiled assets will be output to the `build` folder, you can override this using the `--env.build` arg:

```
npm run dev -- --env.build="custom-folder"
npm start -- --env.build="custom-folder"
```

### Running tests

To run Jest/Enzyme tests:

```
npm test
```

## Contributing

Contributions are welcome to the project - whether they are feature requests, improvements or bug fixes! Refer to 
[CONTRIBUTING.md](CONTRIBUTING.md) for our contribution requirements.

## License

ui-bootstrap is released under our shared source license: https://manywho.com/sharedsource