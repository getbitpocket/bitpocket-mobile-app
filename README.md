[![Build Status](https://travis-ci.org/getbitpocket/bitpocket-mobile-app.svg?branch=master)](https://travis-ci.org/getbitpocket/bitpocket-mobile-app) [![Join the chat at https://gitter.im/getbitpocket/bitpocket-mobile-app](https://badges.gitter.im/getbitpocket/bitpocket-mobile-app.svg)](https://gitter.im/getbitpocket/bitpocket-mobile-app?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Dependency Status](https://david-dm.org/getbitpocket/bitpocket-mobile-app.svg)](https://david-dm.org/getbitpocket/bitpocket-mobile-app)


# BitPocket

Enabling Bitcoin Payments at the Point of Sale.

## Screenshots

<table>
<tr align="center">
<td><img height="450" src="https://cloud.githubusercontent.com/assets/5379359/25736849/bddb2b20-3174-11e7-8cde-eab90f192540.png" alt="BitPocket - Request Payment"></td>
<td><img height="450" src="https://cloud.githubusercontent.com/assets/5379359/25736967/7852a4a6-3175-11e7-9749-b94b86005f36.png" alt="BitPocket - Manage Accounts"></td>
<td><img height="450" src="https://cloud.githubusercontent.com/assets/5379359/25736984/8f12d9fe-3175-11e7-895b-335342e3db89.png" alt="BitPocket - Transaction History"></td>
</tr>
</table>

## Main features

 - Multiple accounts
 - BIP32 HD Keys
 - Testnet support
 - Support for different currencies
 - i18n support

## Development setup

BitPocket is an App based on the Ionic/Cordova Frameworks. Therefore a couple of node modules are required to get started. In order to setup your environment the following global node modules need to be installed: `npm i cordova ionic -g`

After successful installation of the required global modules, do a `npm i` inside the project folder to gather all local module dependencies. Additionally, some cordova plugins are required also. `ionic state reset --plugin` does the trick here.

 - `ionic serve` can be used to test the app locally in the browser, however not all networking features are available.
 - `ionic run (android|ios)` can be used to test the app on a connected device
 - `ionic emulate (android|ios)` can be used to test the app on a emulator/simulator

## Testing

BitPocket is developed alongside unit and e2e testing. Test can be run:

 - `npm run test:unit` for unit tests
 - `npm run test:e2e` for e2e tests

## Translations

 - [English](https://github.com/getbitpocket/bitpocket-mobile-app/blob/master/src/assets/i18n/en.json)
 - [German](https://github.com/getbitpocket/bitpocket-mobile-app/blob/master/src/assets/i18n/de.json)
 - [Polish](https://github.com/getbitpocket/bitpocket-mobile-app/blob/master/src/assets/i18n/pl.json)