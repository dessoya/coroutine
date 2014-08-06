'use strict'

var errors		= require('errors')

function Generator(generatorConstructor, args) {
	this.callback = args.pop()
	args.push(this)
	this.generator = generatorConstructor.apply(this, args)

	this.resume = this.resume.bind(this)
	this.resumeWithError = this.resumeWithError.bind(this)
	this.schedule = 0
	this.groupResult = {}
}

Generator.prototype = {

	resume: function(err, result) {
		this.hasResume = true
		if(err) {
			if(this.throwErrors) {
				var result = this.generator.throw(err)
			}
			else {
				this.error(err)
			}
		}
		else {
			this.next(result)
		}
	},

	resumeWithError: function(err, result) {
		this.next([err, result])
	},

	next: function(value) {

		try {
			var result = this.generator.next(value)
			if(result.done) {
				if(this.hasResume) this.callback(null, result.value)
				else process.nextTick(function() {
					if(this.callback) this.callback(null, result.value)
				}.bind(this))
			}
		}
		catch(err) {
			this.error(err)
		}
	},

	error: function(err) {
		var needShift = !(err instanceof Error)
		err = errors.Common.create(err)
		if(needShift) {
			err.stack.shift()
			err.stack.shift()
		}
		console.showError(err)
		this.callback(err)
	},

	group: function(group_id, operator_id) {

		var ctx = { self: this, group_id: group_id, operator_id: operator_id }
		this.schedule ++

		var f = function(err, result) {

			if(!(this.group_id in this.self.groupResult)) this.self.groupResult[this.group_id] = { }
			this.self.groupResult[this.group_id][this.operator_id] = { err: err, result: result }

			this.self.schedule --

			if(this.self.schedule < 1) {

				var result = this.self.groupResult
				this.self.groupResult = { }

				this.self.next(result)
			}
		}
			
		return f.bind(ctx)
	}

}

function coroutine(generatorConstructor) {
	return function() {
		var generatorObject = new Generator(generatorConstructor, Array.prototype.slice.call(arguments))
		generatorObject.next()
	}
}

module.exports = coroutine