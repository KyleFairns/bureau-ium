const {driver} = require('../browser_setup.js'),
    {config} = require('../config_transformer.js'),
    {Chain} = require('./chain.js'),
    {until} = require('selenium-webdriver');

class Wait extends Chain {

    /**
     * @category UI Interactions
     * @constructs
     * @extends Chain
     * @param {Number} time The amount of time that you want to wait
     * @classdesc For any waiting needed
     * @example new Wait(0.5).seconds
     */
    constructor(time = 1) {
        super();
        this.time = time || 1;

        /**
         * @name switches-wait
         * @memberOf Wait
         * @description
         * "Keyword" Switches:
         *    <ul>
         *        <li>  element
         *        <li>  text
         *        <li>  title
         *        <li>  url
         *    </ul>
         *
         * @example await wait.for.element(element).to.be.visible;
         * await wait.until.title.is("Home");
         * await wait.for.element(element).text.to.become("Continue")
         */
        ["element", "text", "title", "url"].forEach((descriptor) => {
            this.switches[descriptor] = false;
            return this;
        });


        /**
         * @name language-chains-element
         * @memberOf Element
         * @description
         * Language chains:
         *    <ul>
         *        <li>  for
         *        <li>  until
         *        <li>  switch
         *    </ul>
         *
         * @example wait.until.able.to.switch.to.iframe({name: "main"});
         *
         */
        ["for", "until", "switch"].forEach((descriptor) => {
            return this[descriptor] = (() => {
                return this;
            })();
        });
    }

    element(element) {
        this.switches.element = element;
        return this;
    }

    get title(){
        this.switches.title = true;
        return this;
    }
    get text(){
        this.switches.text = true;
        return this;
    }
    get url(){
        this.switches.url = true;
        return this;
    }

    /**
     * @name condition
     * @memberOf Wait
     * @param until
     * @description Waits for the given statement to resolve to true
     * @returns {Promise<*>}
     * @example let element = await wait.for.condition(until.elementIsVisible(element));
     */
    async condition(until) {
        return await driver.wait(until, config.timeouts.step).then(() => {
            return this.resetSwitches;
        });
    }

    /**
     * @name is
     * @memberOf Wait
     * @param string
     * @description Waits for the url, title or element text to become the string given
     * @returns {Promise<*>}
     * @example await wait.until.element(element).text.is("Completed");
     * await wait.until.title.is(bing.home.title.expected);
     * await wait.until.url.is(google.home.url);
     */
    async is(string){
        if(this.switches.title){
            return await this.for.condition(until.titleIs(string))
        } else if (this.switches.text){
            return await this.for.condition(until.elementTextIs(this.switches.element, string))
        } else if (this.switches.url){
            return await this.for.condition(until.urlIs(string))
        }
    }

    /**
     * @name contains
     * @memberOf Wait
     * @param string
     * @description Waits for the url, title or element text to contain the string given
     * @returns {Promise<*>}
     * @example await wait.until.element(element).text.contains("Complete");
     * await wait.until.title.contains(bing.home.title.expected);
     * await wait.until.url.contains(google.home.url.path);
     */
    async contains(string){
        if(this.switches.title){
            return await this.for.condition(until.titleContains(string))
        } else if (this.switches.text){
            return await this.for.condition(until.elementTextContains(this.switches.element, string))
        } else if (this.switches.url){
            return await this.for.condition(until.urlContains(string))
        }
    }

    /**
     * @name matches
     * @memberOf Wait
     * @param regex
     * @description Waits for the url, title or element text to match the string given
     * @returns {Promise<*>}
     * @example await wait.until.element(element).text.matches(/^[Cc]ompleted$/);
     * await wait.until.title.matches(bing.title.format);
     * await wait.until.url.matches(google.result.url.format);
     */
    async matches(regex){
        if(this.switches.title){
            return await this.for.condition(until.titleMatches(string))
        } else if (this.switches.text){
            return await this.for.condition(until.elementTextMatches(this.switches.element, string))
        } else if (this.switches.url){
            return await this.for.condition(until.urlMatches(string))
        }
    }

    /**
     * @name become
     * @memberOf Wait
     * @param string
     * @description Waits for the url, title or element text to become the string given
     * @returns {Promise<*>}
     * @example await wait.for.element(element).text.to.become("Completed");
     * await wait.for.title.to.become(bing.home.title.expected);
     * await wait.for.url.to.become(google.home.url);
     */
    async become(string){
        return await this.is(string);
    }

    /**
     * @name contain
     * @memberOf Wait
     * @param string
     * @description Waits for the url, title or element text to contain the string given
     * @returns {Promise<*>}
     * @example await wait.for.element(element).text.to.contain("Complete");
     * await wait.for.title.to.contain(bing.home.title.expected);
     * await wait.for.url.to.contain(google.home.url.path);
     */
    async contain(string){
        return await this.contains(string);
    }

    /**
     * @name match
     * @memberOf Wait
     * @param regex
     * @description Waits for the url, title or element text to match the string given
     * @returns {Promise<*>}
     * @example await wait.for.element(element).text.to.match(/^[Cc]ompleted$/)
     * await wait.for.title.to.match(bing.title.format)
     * await wait.for.url.to.match(google.result.url.format)
     */
    async match(regex){
        return await this.matches(regex);
    }

    /**
     * @name visible
     * @memberOf Wait
     * @description Waits until element is / isnt visible (depending on "not" switch)
     * @returns {Promise<*>}
     * @example await wait.until.element(element).is.visible;
     * await wait.until.element(element).is.not.visible;
     */
    get visible() {
        return (async () => {
            let element = await this.switches.element.development.find();
            if (this.switches.not) {
                return await this.for.condition(until.elementIsNotVisible(element))
            } else {
                return await this.for.condition(until.elementIsVisible(element))
            }

        })();
    }

    /**
     * @name displayed
     * @memberOf Wait
     * @description Waits until element is / isnt visible (depending on "not" switch)
     * @returns {Promise<*>}
     * @example await wait.until.element(element).is.displayed;
     * await wait.until.element(element).is.not.displayed;
     */
    get displayed() {
        return (async () => {
            return await this.visible;
        })();
    }


    /**
     * @name iframe
     * @memberOf Wait
     * @description Waits until the iframe can be switched to
     * @returns {Promise<*>}
     * @example await wait.until.able.to.switch.to.iframe;
     */
    async iframe(iframe) {
        return await this.for.condition(until.ableToSwitchToFrame(iframe))
    }

    /**
     * @name located
     * @memberOf Wait
     * @description Waits until the element is stale or located (depending on "not" switch)
     * @returns {Promise<*>}
     * @example await wait.until.able.to.switch.to.iframe;
     */
    get located() {
        if (this.switches.not) {
            return (async () => {
                let element = await this.switches.element.development.find();
                return await this.for.condition(until.stalenessOf(element))
            })();
        } else {
            return (async () => {
                return await this.for.condition(until.elementsLocated(this.switches.element.locator))
            })();
        }
    }

    /**
     * @name milliseconds
     * @memberOf Wait
     * @description Waits the given amount of time
     * @returns {Promise<*>}
     * @example await new Wait(500).milliseconds
     *
     */
    get milliseconds() {
        return (async () => {
            return await driver.sleep(this.time);
        })();
    }

    /**
     * @name seconds
     * @memberOf Wait
     * @description Waits the given amount of time
     * @returns {Promise<*>}
     * @example await new Wait(5).seconds
     *
     */
    get seconds() {
        this.time = this.time * 1000;
        return (async () => {
            return await this.milliseconds;
        })();
    }

    /**
     * @name second
     * @memberOf Wait
     * @description Waits for one second
     * @returns {Promise<*>}
     * @example await new Wait().a.second
     *
     */
    get second() {
        this.time = 1;
        return (async () => {
            return await this.seconds;
        })();
    }


}

exports.Wait = Wait;