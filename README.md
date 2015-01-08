#A library to handle numbers & number formats in javascript

## Dist ready
Check the compiled javascripts in the dist directory if you do not want to compile coffeescript by yourself

## Build from sources
You will need a nodejs runtime, grunt-cli for code generation and codo if you want to generate HTML docs
```bash
npm install -g grunt-cli
npm install -g codo
```
Build project into dist/ directory
```bash
git clone git@github.com:sixpounder/numberphilejs.git
npm install && grunt
```
___
## Numbers manipulation

Following examples are for browser-side use.

###### Number parsing
```javascript
N(6000).val() // -> 6000
N("6000,").val() // -> 6000
N("6000,45").val() // -> 6000.45
N("6.000,45").val() // -> 6000.45
```

###### Chainable operations
```javascript
N(6000).add(2000).val() // -> 8000
N(6000).add(2000).add("1,5").val() // -> 8001.5
N("6000,").subtract(2000).val() // -> 4000
N("6000,45").multiply(2).val() // -> 12000.9
N("6.000").divide('2').val() // -> 3000
```

###### Formatting
```javascript
N(6000).val('import'); // -> 6.000,00
N(6000.2).val('import'); // -> 6.000,20
```

For node environment you will find NumberphileReactor class and N wrapper function in your exports
```javascript
var NumberphileReactor = require('numberphilejs').NumberphileReactor
var N = require('numberphilejs').N
```

## jQuery plugin
To easily integrate the library in your DOM we ship an integrated jQuery plugin. The plugin will be triggered for every item having data-numberphile="auto" attribute.

```html
<input data-numberphile="auto" data-format="import" value="123"/>
```

This approach will use data attributes to configure the plugin

```html
<input data-numberphile="auto" data-importMaxDecimalDigits="2" data-format="import" value="123"/>
```

You can still call it yourself

```javascript
$('input.import').numerphile({
    autowire: true, // Automatic binding for DOM events
    importMaxDecimalDigits: 2,
    importDecimalSeparator: ','
    importThoudandsSeparator: '.'
});
```

## jQuery utilities

### Counter
A simple jQuery plugin to trigger increment step on various elements.

The plugin is automatically activated on every element having role="counter-trigger" attribute, and using data attributes for configuration.

To trigger it manually:

```javascript
$('button.step').numberphileCounter({
	step: 1,
	target: 'input.steppable'
});
```
The target attribute is a selector identifying the DOM elements for which the value must be changed when the element you're calling the plugin on gets clicked

###### Example
```html
	<input type="text" class="steppable" value="0" />

	<button role="couter-trigger" data-target=".steppable" data-step="1"></button>
```