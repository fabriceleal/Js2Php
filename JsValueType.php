<?

require_once "JsObjectBase.php";

class JsValueType extends JsObjectBase {
	
	function __construct($php_literal) {
		$this->php_literal = $php_literal;
	}

	function __toString() {
		return "". $this->php_literal;
	}

	function getPhpValue(){
		return $this->php_literal;
	}
}

?>
