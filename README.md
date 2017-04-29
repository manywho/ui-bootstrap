# ManyWho UI Bootstrap

[Bootstrap](https://getbootstrap.com) implementation of the various UI components used by the [ManyWho](https://manywho.com) UI framework.

## Usage

### Building

To build the ui bootstrap components you will need to have [nodejs](http://nodejs.org/), [gulp](http://gulpjs.com/) and [typings](https://github.com/typings/typings) installed.

Then install dependencies:

```
npm install
typings install
```

Then run the dev build:

```
gulp dev-less
gulp dev-ts
gulp dev-bootstrap
gulp dev-bootstrap-themes
gulp dev-fonts
```

Or dist build:

```
gulp dist
```

### Running

You can run:

```
gulp watch
```

Which will re-run the relevant dev tasks whenever a change to the script or less files is made.

By default the compiled assets will be output to the `build` folder, you can override this using the `--build` arg:

```
gulp dev-* --build="custom-folder"
gulp watch --build="custom-folder"
```

## Contributing

Contributions are welcome to the project - whether they are feature requests, improvements or bug fixes! Refer to 
[CONTRIBUTING.md](CONTRIBUTING.md) for our contribution requirements.

## License

ui-bootstrap is released under our shared source license: https://manywho.com/sharedsource