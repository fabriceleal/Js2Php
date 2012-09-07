<?

// Holds values for value-types.
// Otherwise closures won't work!

class JsVariable {

	function __construct($jsObj) {
		$this->varvalue = $jsObj;
	}

	public function getValue() {
		return $this->varvalue;
	}

	public function setValue($val) {
		$this->varvalue = $val;
	}
	
};

?>
