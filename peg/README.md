# Some notes on the PEG file

* Rules in the form:

A = 	
		B operator A
	/ 	B

will be translated to:

A = B (operator A)*

... and treated accordingly. 
This method looked faster than the above in small samples.
