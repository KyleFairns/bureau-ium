const {driver} = require("../browser_setup.js"),
    {FindError, TestError} = require("./errors.js"),
    {Chain} = require("./chain.js"),
    {Wait} = require("./wait.js"),
    wait = new Wait(),
    {until, Key} = require("selenium-webdriver");


class Element extends Chain {
    /**
     * @category UI Interactions
     * @constructs
     * @extends Chain
     * @param {Object} locator The locator for the element. Can be anything accepted by selenium, in the format {<i>type<i>: <i>locator<i>}
     * @classdesc For interacting with the elements on the webpage
     * @example new Element({css: 'input[name="q"]'})
     */
    constructor(locator) {
        super();

        /**
         * @name locator
         * @memberOf Element
         * @description The locator for the element. Can be anything accepted by selenium, in the format {<i>type<i>: <i>locator<i>}
         * @returns Object
         * @example await element.get.locator
         */
        this.locator = locator;


        /**
         * @name switches-element
         * @memberOf Element
         * @description
         * "Keyword" Switches:
         *    <ul>
         *        <li>  send
         *        <li>  sent
         *        <li>  fill
         *        <li>  filled
         *        <li>  type
         *        <li>  typed
         *    </ul>
         *
         * @example element.send.key("enter") // Turns on "send" switch
         * element.can.be.filled.with("Hello, World!") // Turns on "filled" switch
         */
        ["send", "sent", "fill", "filled", "type", "typed", "hold", "held", "release", "released", "development"]
            .forEach((descriptor) => {
                this.switches[descriptor] = false;
            });

        /**
         * @name language-chains-element
         * @memberOf Element
         * @description
         * Language chains:
         *    <ul>
         *        <li>  in
         *        <li>  into
         *    </ul>
         *
         * @example element.type.into.with("Hello, World")
         * element.can.be.typed.into.with("Hello, World")
         *
         */
        ["into"]
            .forEach((descriptor) => {
                return this[descriptor] = (() => {
                    return this;
                })();
            });

    }

    get development(){
        this.switches.development = true;
        return this;
    }

    get send() {
        this.switches.send = true;
        return this;
    }

    get sent() {
        this.switches.sent = true;
        return this;
    }

    get fill() {
        this.switches.fill = true;
        return this;
    }

    get filled() {
        this.switches.filled = true;
        return this;
    }

    get type() {
        this.switches.type = true;
        return this;
    }

    get typed() {
        this.switches.typed = true;
        return this;
    }

    /**
     * @name displayed
     * @memberOf Element
     * @description Asserts the elements visibility
     * @returns {Promise<*>}
     * @example await element.should.eventually.be.displayed
     */
    get displayed() {
        if (this.switches.not) {
            return (async () => {
                await wait.for.element(this).to.not.be.visible;
                return this.resetSwitches;
            })();
        } else {
            return (async () => {
                await wait.for.element(this).to.be.visible;
                return this.resetSwitches;
            })();
        }
    }

    /**
     * @name find
     * @memberOf Element
     * @description Asserts that the element exists in the DOM
     * @returns {Promise<*>}
     * @example await element.find();
     */
    async find() {
        if (this.switches.development) {
            return new Promise(async (resolve) => {
                let element = await driver.findElement(this.locator);
                resolve(element);
            }).catch((e) => {
                throw new FindError(e)
            }).then((result) => {
                return result;
            });
        } else if (this.switches.not) {
            return await (async () => {
                this.switches.development = true;
                return await this.find().catch((e) => {
                    if ((JSON.stringify(e).includes("NoSuchElementError") || JSON.stringify(e).includes("StaleElementReferenceError")) && this.switches.not) {
                        return true;
                    } else {
                        throw new FindError(e);
                    }
                }).then(() => {
                    return this.resetSwitches;
                });
            })();
        } else {
            await wait.for.element(this).to.be.located;
            return this;
        }
    }

    /**
     * @name found
     * @memberOf Element
     * @description Asserts that the element exists in the DOM
     * @returns {Promise<*>}
     * @example await element.can.be.found
     */
    get found() {
        return new Promise(async (resolve) => {
            let result = await this.find();
            resolve(result);
        }).catch((e) => {
            throw new FindError(e)
        }).then((result) => {
            return result;
        });
    }

    /**
     * @name location
     * @memberOf Element
     * @description Gets the co-ordinates of the element
     * @returns {Promise<*>}
     * @example let location = await element.get.location;
     */
    get location() {
        return (async () => {
            return await (await this.development.find().catch((e) => {
                throw new FindError(e)
            }).then((result) => {
                return result;
            })).getRect().catch((e) => {
                throw new TestError(e);
            }).then((result) => {
                return {x: Number(result.x), y: Number(result.y)};
            });
        })();
    }

    /**
     * @name click
     * @memberOf Element
     * @description Clicks on the element provided
     * @returns {Promise<*>}
     * @example await element.click;
     */
    get click() {
        return this.find().catch((e) => {
            throw new FindError(e)
        }).then(async () => {
            return await driver.actions({bridge: true}).move({
                x: 0,
                y: 0,
                origin: await this.development.find()
            }).click().perform().then(() => {
                return this.resetSwitches;
            });
        })
    }

    /**
     * @name clicked
     * @memberOf Element
     * @description Clicks on the element provided
     * @returns {Promise<*>}
     * @example await element.can.be.clicked;
     */
    get clicked() {
        return new Promise(async (resolve) => {
            let result = await this.click;
            return resolve(result);
        }).catch((e) => {
            throw new FindError(e);
        }).then((result) => {
            return result;
        });
    }

    /**
     * @name attribute
     * @memberOf Element
     * @description Gets the attribute given of the element
     * @param {string} attribute
     * @returns {Promise<*>}
     * @example let attribute = await element.get.attribute("id");
     */
    async attribute(attribute) {
        return await this.find().then(async () => {
            return await (await this.development.find().catch((e) => {
                throw new FindError(e)
            }).then((result) => {
                return result;
            })).getAttribute(attribute).then((result) => {
                return result;
            });
        });
    }

    /**
     * @name text
     * @memberOf Element
     * @description Gets the text of the element
     * @returns {Promise<*>}
     * @example let text = await element.get.text;
     */
    get text() {
        return (async () => {
            return await (await this.development.find().catch((e) => {
                throw new FindError(e)
            }).then((result) => {
                return result;
            })).getText().then((result) => {
                return result;
            });
        })().catch((e) => {
            throw new FindError(e);
        }).then((result) => {
            return result;
        });
    }

    /**
     * @name clear
     * @memberOf Element
     * @description Clears the text from the element
     * @returns {Promise<*>}
     * @example await element.clear;
     */
    get clear() {
        return this.find().catch((e) => {
            throw new FindError(e)
        }).then(async () => {
            let text = await this.text;
            for (let i = 0; i < text.length; i++) {
                await found.send.key("back space");
                if (i >= (text.length - 1)) {
                    return this;
                }
            }
        })
    }

    /**
     * @name cleared
     * @memberOf Element
     * @description Clears the text from the element
     * @returns {Promise<*>}
     * @example await element.can.be.cleared;
     */
    get cleared() {
        return new Promise(async (resolve) => {
            let result = await this.clear;
            return resolve(result);
        }).catch((e) => {
            throw new FindError(e);
        }).then((result) => {
            return result;
        });
    }

    get in() {
        return this;
    }

    /**
     * @name with
     * @memberOf Element
     * @description Sends keys to the element
     * @returns {Promise<*>}
     * @example await element.fill.with("Hello, World!");
     * await element.can.be.typed.into.with("Hello, World");
     */
    async with(keys) {
        return await this.clear.then(async () => {
            return await this.send.keys(keys);
        })
    }

    /**
     * @name keys
     * @memberOf Element
     * @description Sends keys to the element
     * @returns {Promise<*>}
     * @example await element.send.keys("Hello, World!");
     */
    async keys(keys) {
        return await this.find().catch((e) => {
            throw new FindError(e)
        }).then(async () => {
            let element = await this.development.find().catch((e) => {
                throw new FindError(e)
            }).then((result) => {
                return result;
            });

            if (this.switches.sent || this.switches.send) {
                return await element.sendKeys(keys).then(() => {
                    return this.resetSwitches;
                });
            } else if (this.switches.hold || this.switches.held) {
                if (key instanceof Array) {
                    return await keys.forEach(async (key) => {
                        await driver.actions({bridge: true}).keyDown(keys).perform();
                    });
                } else {
                    return await driver.actions({bridge: true}).keyDown(keys).perform();
                }
            }else if (this.switches.release || this.switches.released) {
                if (key instanceof Array) {
                    return await keys.forEach(async (key) => {
                        await driver.actions({bridge: true}).keyUp(keys).perform();
                    });
                } else {
                    return await driver.actions({bridge: true}).keyUp(keys).perform();
                }
            }
        })
    }

    /**
     * @name key
     * @memberOf Element
     * @description Sends keys to the element
     * @returns {Promise<*>}
     * @example await element.send.key("H"); // Will send a single letter
     * await element.send.key("enter"); // Will transform into correct modifier key unicode
     */
    async key(key) {
        let modifierKeyCheck = key.toUpperCase().replace(" ", "_");
        let modifiers = ["NULL", "CANCEL", "HELP", "BACK_SPACE", "TAB", "CLEAR", "RETURN", "ENTER", "SHIFT", "CONTROL",
            "ALT", "PAUSE", "ESCAPE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "ARROW_LEFT", "LEFT", "ARROW_UP",
            "UP", "ARROW_RIGHT", "RIGHT", "ARROW_DOWN", "DOWN", "INSERT", "DELETE", "SEMICOLON", "EQUALS", "NUMPAD0",
            "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9",
            "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7",
            "F8", "F9", "F10", "F11", "F12", "COMMAND", "META", "ZENKAKU_HANKAKU"];

        if (modifiers.includes(modifierKeyCheck)) {
            return await this.send.keys(Key[modifierKeyCheck]);
        } else {
            return await this.send.keys(key);
        }
    }

}


exports.Element = Element;