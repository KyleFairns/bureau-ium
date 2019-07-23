class Chain {

    /**
     * @category Internal
     * @constructs
     * @classdesc Adds various words to aid readability, turning on switches that methods will handle
     */
    constructor() {
        /**
         *  @memberOf Chain
         *  @name switches
         *  @description A collection of the switches that have been turned on for an element
         *  @example chain.switches;
         *  @returns Object
         */
        this.switches = {};

        /**
         * @name switches-chain
         * @memberOf Chain
         * @description
         * "Keyword" Switches:
         *    <ul>
         *        <li>  not
         *    </ul>
         *
         * @example element.can.not.be.found // Turns on "not" switch
         */
        ["not"].forEach((descriptor) => {
            this.switches[descriptor] = false;
            return this;
        });


        /**
         * @name language-chains-chain
         * @memberOf Chain
         * @description
         * Language chains:
         *    <ul>
         *        <li>  eventually
         *        <li>  can
         *        <li>  should
         *        <li>  be
         *        <li>  able
         *        <li>  to
         *        <li>  is
         *        <li>  a
         *        <li>  an
         *        <li>  and
         *        <li>  but
         *    </ul>
         *
         * @example chain.eventually.should.be.able.to
         * await chain.can.be
         *
         */
        ["eventually", "can", "should", "be", "able", "to",  "is", "a", "an", "and", "but"].forEach((descriptor) => {
            this[descriptor] = (() => {
                return this;
            })()
        })
    }

    /**
     *  @memberOf Chain
     *  @name get
     *  @description Word for increasing readability
     *  @example chain.get;
     *  @returns Chain
     */
    get get() {
        return this;
    }

    /**
     *  @memberOf Chain
     *  @name resetSwitches
     *  @description Resets all of the switches turned on so that the language chain can continue without error.
     *  @example chain.resetSwitches;
     *  @returns Chain
     */
    get resetSwitches() {
        this.switches = {};
        return this;
    }

    get not() {
        this.switches.not = true;
        return this;
    }
}

exports.Chain = Chain;