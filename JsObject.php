<?

/*
	From: 
		http://www.phpied.com/javascript-style-object-literals-in-php/
		http://activedeveloper.info/prototype-based-object-oriented-programming-in-php.html
		http://sourcemaking.com/design_patterns/prototype/php
		http://sourcemaking.com/design_patterns/prototype/php/2
		http://activedeveloper.info/prototype-based-object-oriented-programming-in-php.html
*/

	class Prototype {

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
	}

	class JsObjectBase {

		public $prototype = null;

		public function __construct() {
			$this->prototype = new Prototype;
		}

		public function __call($name, $arguments) {
			array_unshift($arguments, $this);

			if(is_callable($this->$name)){
				return call_user_func_array($this->$name, $arguments);
			}

			if(is_callable($this->prototype->{$name})){				
				return call_user_func_array($this->prototype->{$name}, $arguments);
			}
		}

		public function __clone() {
			$this->prototype = clone $this->prototype;
		}

		
	}

	class JsObject extends JsObjectBase {

	  function __construct($members = array()) {
		 foreach ($members as $name => $value) {
		   $this->$name = $value;
			if($value instanceof JsFunction){
				$value->setThis($this);
			}
		 }
	  }

		function __toString(){
			return "[JsObject]";
		}

	}

/*
	Usage:

		$fido = new JSObject(array(
		  'name' => "Fido",
		  'barks'=> true,
		  'say'  => function($self) {
			 if ($self->barks) {
				return "Woof";
			 }
		  }
		));

		echo $fido->say();

*/

?>
