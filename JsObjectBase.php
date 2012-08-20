<?

class JsObjectBase {

	public function __construct() {
		
	}

	public function __call($name, $arguments) {
		//print "call!\n";

		array_unshift($arguments, $this);

		if(is_callable($this->$name)){
			return call_user_func_array($this->$name, $arguments);
		}

		if(is_callable($this->prototype->{$name})){				
			return call_user_func_array($this->prototype->{$name}, $arguments);
		}

		return null;
	}

	public function __set($name, $value) {
		$this->{$name} = $value;
	}

	public function __get($name) {
		return $this->{$name};
	}

	public function __isset($name) {
		return isset($this->{$name});
	}

	public function __unset($name) {
		unset($this->{$name});
	}

	static function Create( $copy ){
		return (clone $copy);
	}

}

?>
