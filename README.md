[![Build Status](https://travis-ci.org/getbitpocket/bitpocket-mobile-app.svg?branch=master)](https://travis-ci.org/getbitpocket/bitpocket-mobile-app) [![Join the chat at https://gitter.im/getbitpocket/bitpocket-mobile-app](https://badges.gitter.im/getbitpocket/bitpocket-mobile-app.svg)](https://gitter.im/getbitpocket/bitpocket-mobile-app?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Dependency Status](https://david-dm.org/getbitpocket/bitpocket-mobile-app.svg)](https://david-dm.org/getbitpocket/bitpocket-mobile-app)


# BitPocket Mobile App

## Getting started

BitPocket is an App based on the Ionic/Cordova Frameworks. Therefore a couple of node modules are required to get started. In order to setup your environment the following global node modules need to be installed: `npm i cordova ionic -g`

After successful installation of the required global modules, do a `npm i` inside the project folder to gather all local module dependencies. Additionally, some cordova plugins are required also. `ionic state reset --plugin` does the trick here.

 - `ionic serve` can be used to test the app locally in the browser, however not all networking features are available.
 - `ionic run (android|ios)` can be used to test the app on a connected device
 - `ionic emulate (android|ios)` can be used to test the app on a emulator/simulator

## Translations

Currently English and German 
