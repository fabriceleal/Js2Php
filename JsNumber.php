<?

require_once "JsValueType.php";

class JsNumber extends JsValueType {

	function getType() {
		return "number";
	}

	static function NewInstance($n) {
		return new JsNumber($n);
	}

}

?>
