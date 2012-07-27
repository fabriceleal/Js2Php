<?

class JsFunction {

	function __construct($fun){
		// TODO Check if is function!
		$this->fun = $fun;
		$this->arguments = null;
		$this->defaultThis = $this;
	}
	
	function call($newThis, $args_as_var_args = null){
		return call_user_func_array($this->fun, (array( is_null($newThis) ? $this->defaultThis : $newThis ) + array_slice(func_get_args(), 0)) );
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

	function __call($name, $args) {
	 if (is_callable($this->$name)) {
		array_unshift($args, $this);
		return call_user_func_array($this->$name, $args);
	 }
	}

}

/*
$x = new JsFunction(function($self, $a, $b){
		print "\$self => $self, \$a = $a, \$b = $b\n"; 
		return $a + $b; 
	} );

print "test 1\n";
print $x->call(null, 1, 2) . "\n";
print "test 2\n";
print $x->call(2, 1, 2) . "\n";

$y = new JsFunction(function($self, $a){
	return new JsFunction(
		function($self, $b) use ($a){
			return $a + $b;
		}
	);
});

print "closure test\n";
print ($y->call(null, 1)->call(null, 2)) . "\n";
*/
//print $x->apply(null, array(1, 2)) . "\n";

?>
