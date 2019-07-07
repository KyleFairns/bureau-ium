const fs = require('fs'),
    config = JSON.parse(fs.readFileSync(process.cwd() + '/bureau-ium.config.json')),
    frameworkDefault = { // Default values for the framework to use in the event that something has not been supplied from the config
        host: "https://www.google.co.uk",
        browser: {
            name: "chrome",
            version: "75"
        },
        os: {
            name: "Windows",
            version: "10"
        },
        timeouts: {
            step: 30,
            scenario: 180
        }
    },
    defaultProfile = config.profiles["default"] ? config.profiles["default"] : frameworkDefault,  // If a default profile exists, use it, if not, use system variables
    profile = config.profiles[config.profile] || defaultProfile; // If the profile can be found, use it, or use system default values

// Improvements?
let newConfig = {
    host: profile.host || defaultProfile.host,
    browser: {
        name: profile.browser.name || defaultProfile.browser.name,
        version: profile.browser.version || defaultProfile.browser.version
    },
    os: {
        name: profile.os.name || defaultProfile.os.name,
        version: profile.os.version || defaultProfile.os.version
    },
    timeouts: {
        step: 1000 * (parseInt(profile.timeouts.step, 10) || parseInt(defaultProfile.timeouts.step, 10)),
        scenario: 1000 * (parseInt(profile.timeouts.scenario, 10) || parseInt(defaultProfile.timeouts.scenario)),
    }
};

/**
 * @category Internal
 * @name config
 * @description Processes the config.json in the parent of the features folder
 * Checks stated profile exists, or uses the framework default. Will check every value to see if it exists in the profile
 * stated in the config, then checks for a value in the default profile and will ultimately use the frameworkDefault if
 * nothing else is found
 * @type Object
 */
exports.config = newConfig;