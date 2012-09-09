<?

require_once "JsObject.php";
require_once "JsFunction.php";

// Do not call JsArray->get(0) !!!!!!

class JsArray extends JsObject implements ArrayAccess {

	public $prototype;
	// This one needs to be public so it can be accessed from JsFunctions
	public $raw;
	private $length;

	// ArrayAccess

	function offsetExists($offset){
		return isset($this->raw[$offset]);
	}

	function offsetGet($offset){
		//print "get offset $offset\n";
		return $this->raw[$offset];
	}

	function offsetSet($offset, $value){
		//print "set offset $offset to $value\n";
		$this->raw[$offset] = $value;
	}

	function offsetUnset($offset){
		unset($this->raw[$offset]);
	}

	// end ArrayAccess

	// begin php

	function __get($name) {
		if("length" == $name)
			return count($this->raw);

		if(is_integer($name))
			return $this->raw[$name];

		//print "get $name\n";
		$r = parent::__get($name);
		//print ", is ";
		//print_r($r);
		//print "\n";
		return $r;
	}

	function __set($name, $value) {
		if("length" == $name)
			throw new Exception("You can't set JsArray->length !");
		if("raw" == $name)
			throw new Exception("You can't set JsArray->raw !");

		//print "set $name to $value\n";
		parent::__set($name, $value);
	}

	function __isset($name) {
		return parent::__isset($name, $value);
	}

	function __unset($name) {
		if("length" == $name)
			throw new Exception("You can't unset JsArray->length !");
		if("raw" == $name)
			throw new Exception("You can't unset JsArray->raw !");

		parent::__unset($name);
	}
	
	// end php

	function __construct($members = array()){
		$this->raw = $members;

		// Do not call the constructor of the parent !

		$this->length = count($members);

		$this->prototype = new JsObject(array("constructor" => $this));

		// Push
		$this->prototype->push = new JsFunction(function($self, $values) {  
			// TODO: Push all values ...
			$idx = $self->length + 1;
			
			$self[$idx] = $values;

			// TODO: Return number of values pushed
			return 1;
		} );		
		$this->prototype->push->setThis($this);	

		// Unshift
		$this->prototype->unshift = new JsFunction( function($self, $values){
			// TODO: Unshift all values ...
			return array_unshift($self->raw, $values);
		} );
		$this->prototype->unshift->setThis($this);

		// Map
		$this->prototype->map = new JsFunction( function($self, $fun) {
			$ret = new JsArray();
			foreach($self->raw as $idx => $value) {
				$ret->push->call(null, $fun->call(null, $value, $idx, $self) );
			}
			return $ret;
		} );
		$this->prototype->map->setThis($this);

		// Filter FIXME Attention to the condition: Js wrapper for bools incoming ...
		$this->prototype->filter = new JsFunction( function($self, $fun) {
			$ret = new JsArray();
			foreach($self->raw as $idx => $value) {
				if( $fun->call(null, $value, $idx, $self) ) {
					$ret->push->call(null, $value);
				}
			}
			return $ret;
		} );
		$this->prototype->filter->setThis($this);
	}

	function __toString(){
		return "[JsArray]";
	}

	function toPhpValue(){
		return $this->raw;
/*
		$ret = array();
		for( $i = 0; $i < $this->length; ++$i) {
			$ret[$i] = $this->$i;
		}
		return $ret;*/
	}
}

	

?>
