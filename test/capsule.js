var Capsule = require("capsule");

module.exports['run init and stop'] = function(test) {

	var data = [10, 20];
	
	var c = new Capsule("name", {
		interval: 100,
		maxBlanks: 2		
	}, {
		init: function(name, callback) {callback(null, "DATA")},
		quit: function() { test.done(); },
		execute: function(name, d) { test.ok(data.indexOf(d) >= 0)}
	});

	data.forEach(function(d) {c.push(d)});
};

module.exports['run wrong init'] = function(test) {

	var data = [10, 20];
	
	var c = new Capsule("name", {
		interval: 100,
		maxBlanks: 2		
	}, {
		init: function(name, callback) {callback("err", "DATA")},
		quit: function() { test.done(); },
		execute: function(name, d) { test.fail("sds");}
	});

	data.forEach(function(d) {c.push(d)});
};

module.exports['close before running'] = function(test) {

	var data = [10, 20];
	
	var c = new Capsule("name", {
		interval: 100,
		maxBlanks: 10		
	}, {
		init: function(name, callback) {callback(null, "DATA")},
		quit: function() { test.fail("should not quiting"); },
		execute: function(name, d) { test.fail("shoud not execute");}
	});

	c.close();
	data.forEach(function(d) {c.push(d)});

	setTimeout(function() { test.done(); }, 100);
};