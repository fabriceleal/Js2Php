<?

/*
	From: http://www.phpied.com/javascript-style-object-literals-in-php/
*/

	class JsObject {

	  function __construct($members = array()) {
		 foreach ($members as $name => $value) {
		   $this->$name = $value;
			if($value instanceof JsFunction){
				$value->setThis($this);
			}
		 }
	  }

	  function __call($name, $args) {
		 if (is_callable($this->$name)) {
		   array_unshift($args, $this);
		   return call_user_func_array($this->$name, $args);
		 }
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
