#A library to handle numbers & number formats in javascript
___
Still a work in progress, please be patient :)

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