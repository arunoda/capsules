var Capsules = require('capsules');

module.exports['run and go - one'] = function (test) {
	
	var dataArr = [10, 20, 30];
	var initData = {yes: true};

	var c = new Capsules({ interval: 10, maxBlanks: 3 });	
	c.on("init", function (name, callback) {
		test.equal(name, 'one');
		callback(null, initData)
	});

	c.on('execute', function(name, d, configData) {
		
		test.equal(name, 'one');
		test.equal(configData, initData);
		test.ok(dataArr.indexOf(d) >= 0);
	});

	c.on('quit', function(name, message) {
		
		test.equal(name, 'one');
		test.done();
	});

	dataArr.forEach(function(d) { c.action('one', d); });
};

module.exports['run and go - two instances'] = function (test) {
	
	test.expect(22);

	var names = ['one', 'two'];
	var dataArr = [10, 20, 30];
	var initData = {yes: true};

	var c = new Capsules({ interval: 10, maxBlanks: 3 });	
	c.on("init", function (name, callback) {
		test.ok(names.indexOf(name) >= 0);
		callback(null, initData)
	});

	c.on('execute', function(name, d, configData) {
		test.ok(names.indexOf(name) >= 0);
		test.equal(configData, initData);
		test.ok(dataArr.indexOf(d) >= 0);
	});

	c.on('quit', function(name, message) {
		
		test.ok(names.indexOf(name) >= 0);
	});

	dataArr.forEach(function(d) { c.action('one', d); });
	dataArr.forEach(function(d) { c.action('two', d); });

	setTimeout(function() {test.done();}, 200);
};

module.exports['close before action'] = function (test) {
	
	var dataArr = [10, 20, 30];
	var initData = {yes: true};

	var c = new Capsules({ interval: 10, maxBlanks: 3 });	
	c.on("init", function (name, callback) {
		test.equal(name, 'one');
		callback(null, initData)
	});

	c.on('execute', function(name, d, configData) {
		
		console.log('execute %s %s', name, d);
		test.fail('should not execute');
	});

	c.on('quit', function(name, message) {
		
		test.fail('should not quit');
	});

	c.close();

	dataArr.forEach(function(d) { c.action('one', d); });

	setTimeout(function() { test.done(); }, 200);
};

module.exports['close after action'] = function (test) {
	
	var dataArr = [10, 20, 30];
	var initData = {yes: true};

	var c = new Capsules({ interval: 10, maxBlanks: 3 });	
	c.on("init", function (name, callback) {
		test.equal(name, 'one');
		callback(null, initData)
	});

	c.on('execute', function(name, d, configData) {
		
		console.log('execute %s %s', name, d);
		test.fail('should not execute');
	});

	c.on('quit', function(name, message) {
		
		test.fail('should not quit');
	});

	dataArr.forEach(function(d) { c.action('one', d); });
	c.close();
	
	setTimeout(function() { test.done(); }, 200);
};