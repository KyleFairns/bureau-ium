const {Chain} = require("./chain.js"),
    {Wait} = require("./wait.js"),
    wait = new Wait();

let {driver} = require("../browser_setup.js");


class Browser extends Chain {

    /**
     * @category UI Interactions
     * @constructs
     * @extends Chain
     * @classdesc For interacting with the browser window
     */
    constructor() {
        super();

        /**
         * @name language-chains-browser
         * @memberOf Browser
         * @description
         * Language chains:
         *    <ul>
         *        <li>  current
         *    </ul>
         *
         * @example element.type.into.with("Hello, World")
         * element.can.be.typed.into.with("Hello, World")
         *
         */
        ["current"].forEach((descriptor) => {
            return this[descriptor] = (() => {
                return this;
            })();
        });
    }

    /**
     *  @memberOf Browser
     *  @name url
     *  @description Gets the current url
     *  @example browser.get.current.url;
     */
    static get url() {
        return (async () => {
            return await driver.getCurrentUrl();
        })();
    }

    /**
     *  @memberOf Browser
     *  @name quit
     *  @description Quits the current browser TODO: Implement a restart
     *  @example browser.quit;
     */
    static get quit() {
        return driver.quit();
    }

    /**
     * @name browse
     * @memberOf Browser
     * @description Navigates to the url
     * @returns {Promise<*>}
     * @example await browser.browse(url)
     */
    async browse(url) {
        await driver.get(url.url);
        return this;
    }

    /**
     *  @memberOf Browser
     *  @name maximise
     *  @description Makes the browser full-screen
     *  @example browser.maximise;
     */
    get maximise() {
        return wait.a.second.then(async () => {
            await driver.manage().window().maximize();
            return this;
        })
    }
}

exports.Browser = Browser;