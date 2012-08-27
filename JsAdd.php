<?

function add($a = null, $b = null){
	/*
		If any of the args is NOT a number, use the concat 
		operation instead of the numerical-add one.
	*/
	if(is_numeric($a) && is_numeric($b))
		return ($a + $b);
	else
		return ($a . $b);
}

?>
