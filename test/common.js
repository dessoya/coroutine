'use strict'

var assert				= require('assert')
  , Class				= require('class')
  , util				= require('util')
  , coroutine			= require('coroutine')
  , errors				= require('errors')


describe('Module coroutine', function() {
/*
	it('case 1 normal execute', function(done) {

		var old = console.showError
		console.showError = function() {}

		var f = function(a1, a2, a3, callback) {
			//console.log('f1')
			setTimeout(function() {
				//console.log('f2')
				callback(null, a1 + a2 + a3)
			}, 10)
		}

		var f2 = function(a1, a2, a3, callback) {
			setTimeout(function() {
				callback(123)
			}, 10)
		}

		var g1 = coroutine(function*(a1, a2, a3, g) {
			// var r = yield g.execute(f, 1, 2, 3)
			var r = yield f(1, 2, 3, g.resume)

			g.throwErrors = true

			var r1 = 0
			//console.log(1)
			try {
				r += yield f2(1, 2, 3, g.resume)
				//console.log(2)
				// a = 10
			}
			catch(e) {
				//console.log(3)
				r1 = 10
				// console.log(util.inspect(e,{depth:null}))
			}

			//console.log(4)

			r += yield f(1, 2, 3, g.resume)
			//console.log(5)
			//console.log(r + 1 + r1)

			return r + 1 + r1
		})

		g1(1, 2, 3, function(err, result) {
			assert.strictEqual(err, null, 'err')
			assert.strictEqual(result, 17 + 6, 'result')
			console.showError = old
			done()
		})

	})

	it('case 2 error in try', function(done) {

		var f2 = function(a1, a2, a3, callback) {
			setTimeout(function() {
				callback(123)
			}, 10)
		}

		var g1 = coroutine(function*(a1, a2, a3, g) {
			g.throwErrors = true

			var r1 = 0
			//console.log(1)
			try {
				r += yield f2(1, 2, 3, g.resume)
				//console.log(2)
				// a = 10
			}
			catch(e) {
				//console.log(3)
				r1 = 10
				// console.log(util.inspect(e,{depth:null}))
			}

			return r1
		})

		g1(1, 2, 3, function(err, result) {
			assert.strictEqual(err, null, 'err')
			assert.strictEqual(result, 10, 'result')
			done()
		})

	})

	it('case 4 exit after try', function(done) {

		var f2 = function(a1, a2, a3, callback) {
			setTimeout(function() {
				callback(123)
			}, 10)
		}

		var g1 = coroutine(function*(a1, a2, a3, g) {

			g.throwErrors = true
			var r1 = 0
			//console.log(1)
			try {
				r += yield f2(1, 2, 3, g.resume)
				//console.log(2)
				// a = 10
			}
			catch(e) {
				//console.log(3)
				r1 = 10
				// console.log(util.inspect(e,{depth:null}))
			}

			return r1
		})

		g1(1, 2, 3, function(err, result) {
			assert.strictEqual(err, null, 'err')
			assert.strictEqual(result, 10, 'result')
			done()
		})

	})

	it('case 5 first yield error', function(done) {

		var old = console.showError
		console.showError = function() {}

		var f2 = function(a1, a2, a3, callback) {
			setTimeout(function() {
				callback(123)
			}, 10)
		}

		var g1 = coroutine(function*(a1, a2, a3, g) {

			var r = yield f2(1, 2, 3, g.resume)

			return r
		})

		g1(1, 2, 3, function(err, result) {
//			console.log(err)
			assert.strictEqual(err.error, 123, 'err')
			assert.strictEqual(result, undefined, 'result')
			console.showError = old
			done()
		})

	})

	it('case 6 syntax error', function(done) {

		var old = console.showError
		console.showError = function() {}

		var g1 = coroutine(function*(a1, a2, a3, g) {

			a = 10

			return r
		})

		g1(1, 2, 3, function(err, result) {
			// console.log(err)
			assert.strictEqual(err.error, 'ReferenceError: a is not defined', 'err')
			assert.strictEqual(result, undefined, 'result')
			console.showError = old
			done()
		})

	})

	it('case 7 gen in gen', function(done) {

		var g1 = coroutine(function*(a1, a2, a3, g) {

			return 11
		})

		var g2 = coroutine(function*(a1, a2, a3, g) {

			var r = yield g1(1, 2, 3, g.resume)

			return r
		})

		g2(1, 2, 3, function(err, result) {
			assert.strictEqual(err, null, 'err')
			assert.strictEqual(result, 11, 'result')
			done()
		})

	})


	it('case 8 group', function(done) {

		var f = function(a1, a2, a3, callback) {
			setTimeout(function() {
				callback(null, a1 + a2 + a3)
			}, 10)
		}

		var g1 = coroutine(function*(a1, a2, a3, g) {

			f(1, 2, 3, g.group(1,1))
			f(2, 3, 4, g.group(1,2))

			var r = yield 0
			// console.log(util.inspect(r,{depth:null}))

			return r
		})

		g1(1, 2, 3, function(err, result) {

			assert.strictEqual(err, null, 'err')
			// console.log(util.inspect(result, {depth:null,showHidden:true}))
			// console.log(JSON.stringify(result))
			assert.strictEqual(JSON.stringify(result), '{"1":{"1":{"err":null,"result":6},"2":{"err":null,"result":9}}}', 'result')

			done()
		})

	})
*/

	it('case 9 deep coroutine', function(done) {

		var Delta = Class.inherit({

			onCreate: function(eventCallback) {
				this.eventCallback = eventCallback
			},

			apply: function(items, callback) {
				this.gen_apply(this, items, callback)
			},

			gen_apply: coroutine(function*(delta, items, g) {

				console.log('a 1')
				yield delta.eventCallback(g.resume)
				console.log('a 2')

				// yield delta.eventCallback(g.resume)
				// console.log('a 3')

				return true

			})

		})

		var d = Delta.create(function(callback) {
			console.log('d 1')
			process.nextTick(callback)
			//callback()
			console.log('d 2')
		})

		coroutine(function*(g) {

			console.log(1)

			yield d.apply({}, g.resume)

			console.log(2)


		})(function(err, result) {

			console.log('main done')
			console.log(util.inspect([err, result], {depth:null}))

			 done()
		})

	})

})