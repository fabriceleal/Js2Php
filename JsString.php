<?

require_once "JsValueType.php";

class JsString extends JsValueType {

	function getType() {
		return "string";
	}

	static function NewInstance($n){
		return new JsString($n);
	}
}

?>
