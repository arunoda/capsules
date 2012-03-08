/**
	Capsule runs logic in a timedout way

	@param name - name of the capsule
	@param config - config parameters
		interval - the inteval to run by the capsule
		maxBlanks - no of maximum blank cycles
*/

module.exports = function Capsule(name, config, env) {

	var self = this;

	config.interval = config.interval || 500;
	config.maxBlanks = config.maxBlanks || 100;
	
	var configData = null;

	var rannedCycles = 0;
	var blankCycles = 0;

	var data = [];

	var intervalHandler = null;

	var closed = false;

	/**
		Add Data to work with
	*/
	this.push = function push(item) {
	
		data.push(item);	
	};

	this.close = function close() {
	
		closed = true;
		clearInterval(intervalHandler);
		delete data;	
	};

	//start the capsule
	start();

	/*** PRIVATE METHODS ****/

	function start() {
		
		//looking for initiating capsule and gettting configData
		env.init(name, afterInited);

		function afterInited(err, configData_) {
			
			if(!err) {
				configData = configData_;
				intervalHandler = setInterval(capsuleLogic, config.interval);
				//start at the next cycle
				process.nextTick(function() { capsuleLogic();	});

			} else {

				//cannot proceed with error when initiating
				self.close();
				env.quit(name, "ERROR_INITIATING");
			}
		}
	};

	function capsuleLogic() {
		
		rannedCycles++;

		if(closed) {
			//should not run when closed

		} else if(blankCycles < config.maxBlanks) {

			//maxBlanks are not exceeded
			var item = data.shift();
			if(item) {

				//execute the logic for this cycle
				env.execute(name, item, configData);
				blankCycles = 0;
			} else {

				//there is nothing to execute
				blankCycles ++;
			}	

		} else {
			
			//if no of blankCycles exceeded the allowed amount
			clearInterval(intervalHandler);
			env.quit(name, "IDLE");
			delete data;
		}

	}
};