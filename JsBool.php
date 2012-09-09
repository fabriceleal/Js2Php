<?

require_once "JsValueType.php";

class JsBool extends JsValueType {

	function getType() {
		return "bool";
	}

	static function NewInstance($n){
		return new JsBool($n);
	}

	function IsTrue(){
		return true === $this->getPhpValue();
	}
	
	static function ConvertToJsBool($jsObject) {
		if(null === $jsObject)
			return new JsBool(false);

		if($jsObject instanceof JsBool)
			return $jsObject;

		// Php bool literals
		if(false === $jsObject || true === $jsObject)
			return new JsBool($jsObject);

		// any valid objects return true
		return new JsBool(true);
	}

	function __construct($val) {
		if(false !== $val && true !== $val)
			throw new Exception('No boolean literal!');

		parent::__construct($val);
	}
}

?>
