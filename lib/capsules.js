var Capsule = require('./capsule');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Capsules(config) {

		var self = this;
		var capsules = {};

		var closed = false;

		var environment = {

			init: function init(name, callback) {
				self.emit('init', name, callback);
			},

			execute: function execute(name, data, configData) {
				self.emit("execute", name, data, configData);	
			},
			
			quit: function abort(group, message) {
				delete capsules[group];
				self.emit("quit", group, message);
			}
		};

		this.action = function(group, data) {
			
			if(!closed) {
				
				if(!capsules[group]) {
					capsules[group] = new Capsule(group, config, environment);
				}
			
				capsules[group].push(data);
			}
		};

		this.close = function() {

			closed = true;
			for(var group in capsules) {

				var capsule = capsules[group];
				capsule.close();
				delete capsules[group];
			}	
		};
};

util.inherits(Capsules, EventEmitter);

module.exports = Capsules;