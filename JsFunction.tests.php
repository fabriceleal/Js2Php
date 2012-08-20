<?
require_once "JsFunction.php";

print "As class:\n";

print "* Definition of a ...\n";
$a = new JsFunction(function(){ });
$a->prototype->id = 1;
$a->prototype->name = "a";

print "* Definition of b ...\n";
$b = new JsFunction(function($self){ $self->a = "qweqwe"; });
$b->prototype = $a->NewInstance();
$b->prototype->constructor = $b;
$b->prototype->name = "b";


print "* Instance of b ...\n";
$ib = $b->NewInstance();
print_r($ib);

print "* Instance of b2 ...\n";
$ib2 = $b->NewInstance();
print_r($ib2);

print "* Instance of a ...\n";
$ia = $a->NewInstance();
print_r($ia);


print "Calling, Closures ...\n";

$x = new JsFunction(function($self, $a, $b){
		print "\$self = $self, \$a = $a, \$b = $b\n"; 
		return $a + $b; 
	} );

print "test 1\n";
print "Should print \"\$self = [JsFunction], \$a = 1, \$b = 2\", result = 3:\n";
print $x->call(null, 1, 2) . "\n";
print "test 2\n";
print "Should print \"\$self = 2, \$a = 1, \$b = 2\", result = 3:\n";
print $x->call(2, 1, 2) . "\n";

$y = new JsFunction(function($self, $a){
	return new JsFunction(
		function($self, $b) use ($a){
			return $a + $b;
		}
	);
});

print "closure test\n";
print "Both should print 3:\n";

print "Sum = " . ($y->call(null, 1)->call(null, 2)) . "\n";
print "Sum = " . $x(1, 2) . "\n";

?>
