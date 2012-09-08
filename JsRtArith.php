<?

require_once "JsNumber.php";
require_once "JsString.php";

class JsRtArith {

	static function add($a = null, $b = null){
		/*
			If any of the args is NOT a number, use the concat 
			operation instead of the numerical-add one.
		*/
		if($a != null && $b != null && $a->getType() == 'number' && $b->getType() == 'number')
			return new JsNumber($a->getPhpValue() + $b->getPhpValue());
		else
			return new JsString($a->getPhpValue() . $b->getPhpValue());
	}

	static function subt($a = null, $b = null){
		if($a != null && $b != null && $a->getType() == 'number' && $b->getType() == 'number')
			return new JsNumber($a->getPhpValue() - $b->getPhpValue());
		else
			return new JsNumber(NAN);
	}

	static function mult($a = null, $b = null){
		if($a != null && $b != null && $a->getType() == 'number' && $b->getType() == 'number')
			return new JsNumber($a->getPhpValue() * $b->getPhpValue());
		else
			return new JsNumber(NAN);
	}

	static function div($a = null, $b = null){
		if($a != null && $b != null && $a->getType() == 'number' && $b->getType() == 'number')
			return new JsNumber($a->getPhpValue() / $b->getPhpValue());
		else
			return new JsNumber(NAN);
	}
}

?>
