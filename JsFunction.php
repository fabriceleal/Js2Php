<?

require_once "JsObject.php";


class JsFunction extends JsObject {

	private $fun;
	private $arguments;
	private $defaultThis;

	public $prototype;

	function __construct($fun){
		// TODO Check if it's a function!
		$this->fun = $fun;
		$this->arguments = null;
		$this->defaultThis = $this;

		$this->prototype = new JsObject(array("constructor" => $this));
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
		//print_r(func_get_args());
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

	static function NewInstance(){

		// Create copy of the prototype
		$r = JsObjectBase::CreateWithProto($this->prototype);

		// Call constructor in prototype (or function itself, if undef) with $r as this
		if(isset($this->prototype->constructor) && $this->prototype->constructor == null)
			$this->call($r, func_get_args());		
		else
			$this->prototype->constructor->call($r, func_get_args());
		
		// Shadow the constructor, its weird
		$r->constructor = null;

		return $r;
	}

}


?>
