# Js2Php

### What is Js2Php?

A basic, experimental Javascript to PHP translator.

### What Js2Php is NOT

A full-node.js-web-app to PHP translator. 

### What you can expect from Js2Php

The goal is to translate Javascript modules into PHP. One should be able to use these modules from PHP code.

### What does Js2Php support?

Check the tests results to get a feel of what is to be expected from this project. Remember that this is a "basic, experimental Javascript to PHP translator"!

### TODO

* Implement JsRt*.php classes
* The grammar doesn't return AST for a "for-loop".

### Notes on Javascript syntax
***not final***

* Do not embbed comments inside expressions. Avoid stuff like this:

```javascript
	fun_call(1 /* This is illegal syntax for me ...*/, 
			2 // This too ...
			);
```

This is ok though:
```javascript

	/* This is ok for me ...*/
	// This too ...

	fun_call(1, 2);
```

* Be very strict; some advices:
	* Always use ";"
	* ...

* Expect missing features / bugs. Please report them (use the issues page) or fork and improve ;)

