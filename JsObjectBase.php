<?

class JsObjectBase {
	private $prototype;
	private $store;

	public function __construct() {
		$store = array();
	}

	public function __call($name, $arguments) {
		//print "call!\n";

		array_unshift($arguments, $this);

		if(isset($this->store->{$name})){
			if(is_callable($this->store->{$name})){
				return call_user_func_array($this->store->{$name}, $arguments);
			} else {
				throw new Exception("$name is not a function!");
			}
		}

		if(isset($this->prototype->{$name})){
			if(is_callable($this->prototype->{$name})){				
				return call_user_func_array($this->prototype->{$name}, $arguments);
			} else {
				throw new Exception("$name is not a function!");
			}
		}

		throw new Exception("Trying to call null as function!");
	}

	/*
		Creates a property. Shadows the prototype's property if it exists.
	*/
	public function __set($name, $value) {
		$this->store->{$name} = $value;
	}

	/*
		If the obj itself has the property (regardless of being null), return it.
		Otherwise, if it has a prototype, return the property of the prototype.
		Otherwise, return null;
	*/
	public function __get($name) {
		//print "Getting $name\n";

		if(isset($this->store->{$name}))
			return $this->store->{$name};

		//print "Getting $name from prototype\n";

		if(isset($this->prototype) && isset($this->prototype->{$name}))
			return $this->prototype->{$name};

		//print "Fail getting $name\n";
		return null;
	}

	/*
		Check if $name is a valid member of the object (it most be either in the obj itself or in the prototype)
	*/
	public function __isset($name) {
		//print "Called isset for $name\n";
		return isset($this->store->{$name}) || isset($this->prototype->{$name});
	}

	/*
		Unset a var only in the obj itself (do not touch in the prototype!!!)
	*/
	public function __unset($name) {
		unset($this->store->{$name});
	}

	/*
		Perfect clone of an obj
	*/
	static function Create( $original ){
		return (clone $original);
	}

	/*
		Create new object using a prototype
	*/
	static function CreateWithProto( $prototype ){
		$r = new JsObjectBase();
		$r->prototype = $prototype;
		return $r;
	}

}

?>
