const {Builder} = require('selenium-webdriver');
const {config} = require('./config_transformer.js');

require("chromedriver");

let shouldIPause = false,
    driver;

// Integrate with BrowserStack for more browsers
function startDriver() {
    if (!driver) {
        return new Builder().forBrowser(config.browser.name).build();
    } else {
        return driver;
    }
}

function pause() {
    let shouldIPause = true;
}

function getPaused() {
    return shouldIPause;
}

/**
 * @category Internal
 * @name driver
 * @description Uses the config to create a browser for the specifications asked for.
 * (this will only work when paired with something like BrowserStack - remote connection to a virtual machine with the
 * browsers specified, handled by the startDriver function, and will run the Selenium code through it natively).
 * Could also add parallel functionality within the framework itself after doing a re-haul, whereby a parallel executor
 * will wrap tests (this may end up being a mocha only feature, but with more thought may work for cucumber)
 */

exports.driver = startDriver();
exports.pause = pause;
exports.getPaused = getPaused;


