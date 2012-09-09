<?

require_once "JsArray.php";
require_once "JsNumber.php";

$a = new JsArray(array());
$tmp = $a->toPhpValue();
print_r ($tmp);

$a->push->call(null, new JsNumber(1));

$tmp = $a->toPhpValue();
print_r ($tmp);

$a->unshift->call(null, new JsNumber(3));

$tmp = $a->toPhpValue();
print_r ($tmp);

print $a[0] ."\n";
print $a->length ."\n";

$t = new JsFunction(function($self, $i){ return new JsNumber($i->getPhpValue() * 2); });
$newa = $a->map->call(null, $t);
print_r($newa);



?>
