<?

/*
	From: 
		http://www.phpied.com/javascript-style-object-literals-in-php/
		http://activedeveloper.info/prototype-based-object-oriented-programming-in-php.html
		http://sourcemaking.com/design_patterns/prototype/php
		http://sourcemaking.com/design_patterns/prototype/php/2
		http://activedeveloper.info/prototype-based-object-oriented-programming-in-php.html
*/

/*
	Javascript inheritance:

	var f = function(){
		...
	}

	var i = function(){
		...
	}

	i.prototype = new f();
	i.prototype.constructor = i;

	Mapping to PHP:
	?????


	* The function object has a prototype. Instances dont

*/

require_once "JsObjectBase.php";

class JsObject extends JsObjectBase {

	public $prototype;

	function __construct($members = array()) {
		parent::__construct();

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
