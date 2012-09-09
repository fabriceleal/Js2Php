<?

require_once "JsArray.php";
require_once "JsNumber.php";
require_once "JsBool.php";

$a = new JsArray(array());
$tmp = $a->getPhpValue();
print_r ($tmp);

$a->push->call(null, new JsNumber(1));

$tmp = $a->getPhpValue();
print_r ($tmp);

$a->unshift->call(null, new JsNumber(3));

$tmp = $a->getPhpValue();
print_r ($tmp);

print $a[0] ."\n";
print $a->length ."\n";

print "MAP:\n";
$t = new JsFunction(function($self, $i){ return new JsNumber($i->getPhpValue() * 2); });
$newa = $a->map->call(null, $t);
print_r($newa->getPhpValue());


print "REDUCE:\n";
$t = new JsFunction(function($self, $tot, $i){ return new JsNumber($tot->getPhpValue() + $i->getPhpValue()); });
$tot = $newa->reduce->call(null, $t, new JsNumber(0));
print $tot->getPhpValue() . "\n";


print "FILTER:\n";
$t = new JsFunction(function($self, $i){ return JsBool::ConvertToJsBool( $i->getPhpValue() > 2 ); });
$newa = $newa->filter->call(null, $t);
print_r($newa->getPhpValue());


?>
