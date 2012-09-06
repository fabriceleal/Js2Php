# Some notes on the PEG file

* Rules in the form:

A = 	
		B operator A
	/ 	B

will be translated to:

A = B (operator A)*

... and treated accordingly. 
This latter method looked faster than the other in small samples.
