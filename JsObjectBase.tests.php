<?

require_once "JsObjectBase.php";

// TESTS:
$a = new JsObjectBase();
$a->id = 123;
print "$a->id\n";

$a->barf = function(){
	print "houf!\n";
};
print $a->barf();

$b = JsObjectBase::Create($a);

$b->id = 321;

print "Ids should be different!\n";

print_r($a);
print_r($b);

?>
