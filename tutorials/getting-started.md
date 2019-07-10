## Getting Started

Bureau-ium can be used with any test framework, and in this example, I've used Mocha to demonstrate the readability that bureau provides (Dynamic Loading being the best example).

The POM is an object that works through a series of files and requires.
First, you'll want to add a page or a site into the POM, using an object with language chains, you can make the tests self documenting:

Page/Area for use in POM:
``` 
const {Element} = require("bureau-ium");
let navigation = {
    menu = {
	    item: (text) => {
		    return new Element({linkText: text});
	    }
    }
}
exports.navigation = navigation;
```

Add a require in the index file for that folder, (or make a new one and reference that new index file in the parent folder's index file) so that the language chain can reach the elements that you have just documented.

Parent Index:
```
let pom = {
    main: {
        navigation: require("./navigation").navigation
    }
}

exports.pom = pom;
```

These are now usable in a test:

``` 
const {pom} = require(`${process.cwd()}/test-suite/pom/pom.js`),
    menu = pom.main.navigation.menu;

describe("A Menu Item", ()=>{
	it("should be clickable", async ()=>{
		return await (await menu.item("Home").can.be.found).and.can.be.clicked
	})
}) 
```