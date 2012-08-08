<?

class JsFunction {

	function __construct($fun){
		// TODO Check if is function!
		$this->fun = $fun;
		$this->arguments = null;
		$this->defaultThis = $this;
	}

	function __invoke(){
		// Get args for the invocation
		$args = func_get_args();

		// Insert null as first parameter
		array_unshift($args, null);

		// Call the "call" method
		return call_user_func_array(array($this, 'call'), $args);
	}
	
	function call($newThis){
		print_r(func_get_args());
		$head = array( is_null($newThis) ? $this->defaultThis : $newThis );
		//print_r($head);
		return call_user_func_array($this->fun, ($head + array_slice(func_get_args(), 0)) );
	}

	function setThis( $newThis ){
		$this->defaultThis = $newThis;
	}

	function getThis(){
		return $this->defaultThis;
	}

	/*function apply($newThis, $args_as_arr){
		return call_user_func_array( $this->fun, $args_as_arr);
	}*/

	/*function __call($name, $args) {
	 if (is_callable($this->$name)) {
		array_unshift($args, $this);
		return call_user_func_array($this->$name, $args);
	 }
	}*/

	function __toString(){
		return "[JsFunction]";
	}

}


$x = new JsFunction(function($self, $a, $b){
		print "\$self = $self, \$a = $a, \$b = $b\n"; 
		return $a + $b; 
	} );
/*
print "test 1\n";
print "Should print \"\$self = [JsFunction], \$a = 1, \$b = 2\", result = 3:\n";
print $x->call(null, 1, 2) . "\n";
print "test 2\n";
print "Should print \"\$self = 2, \$a = 1, \$b = 2\", result = 3:\n";
print $x->call(2, 1, 2) . "\n";

$y = new JsFunction(function($self, $a){
	return new JsFunction(
		function($self, $b) use ($a){
			return $a + $b;
		}
	);
});*/
/*
print "closure test\n";
print "Should print 3:\n";
print ($y->call(null, 1)->call(null, 2)) . "\n";
*/
print "Sum = " . $x(1, 2) . "\n";

?>
