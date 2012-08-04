A Javascript (Node.js) to PHP compiler

I'm not a PHP (or Javascript, for that matter) expert, so expect lots of missing functionality, bugs, and WTF code. At least for now. :|

This will take some time (or halt...) because I can't seem to put a javascript grammar to work ...

- Some notes on the PEG file: -

* Rules in the form:

A = 	
		B operator A
	/ 	B

will be translated to:

A = B (operator A)*

... and treated accordingly. 
This method looked faster than the above in small samples.

* Do not embbed comments inside expressions. Avoid stuff like this:

```javascript
	fun_call(1 /* This is illegal syntax for me ...*/, 
			2 // This too ...
			);
```javascript

This is ok though:
```javascript

	/* This is ok for me ...*/
	// This too ...

	fun_call(1, 2);
```javascript

* Be very strict; some advices:
** Always use ";"
** TODO

* Expect missing features and bugs.

