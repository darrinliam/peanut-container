/* eslint-env mocha */
'use strict';

const assert = require('assert');

const peanutContainerClass = require('../peanutContainer');
const peanutContainer = new peanutContainerClass();

const rootData = require('../examples/rootData');
const fetchRhymesTesterClass = require('../examples/fetchRhymesTester');
const rhymesServiceClass = require('../examples/services/rhymesService');
const fetchMsgData = require('../examples/dbMsg.js');

peanutContainer.register({ name: 'config', deps: [], def: rootData });
peanutContainer.register({ name: 'fetchRhymes', deps: ['config', 'fetchMsg'], def: fetchRhymesTesterClass });
peanutContainer.register({ name: 'rhymesService', deps: ['fetchRhymes'], def: rhymesServiceClass});
peanutContainer.register({ name: 'fetchMsg', deps: [], def: fetchMsgData})

const rhymesApp = peanutContainer.get('rhymesService');

if (rhymesApp)
{
	describe('OK', function() {
		describe("OK 1: rhymes for 'wonder'.", function() {
			it(' ', function() {
				assert.deepEqual(rhymesApp.getRhymes('wonder'), { rhyming_words: [ 'asunder', 'plunder', 'under' ] });
			});
		});
		
		describe("OK 2: rhymes for 'pterodactyl'. No rhymes found.", function() {
			it(' ', function() {
				assert.deepEqual(rhymesApp.getRhymes('pterodactyl'), { rhyming_words: [] });
			});
		});
	});
	
	
	describe('Error tests.', function() {
		describe("Error 1: circular dependency (self).", function() {
			it(' ', function() {

			assert.equal(
				peanutContainer.register({ name: 'ABC', deps: ['XXX', 'ABC'], def: fetchRhymesTesterClass}),
				null);
			});
		});
		
		describe("Error 2: circular dependency (3-way).", function() {
			it(' ', function() {
				peanutContainer.register({ name: 'XXX', deps: ['qqq', 'AAA'], def: fetchRhymesTesterClass});
				peanutContainer.register({ name: 'AAA', deps: ['BBB'], def: fetchRhymesTesterClass});
			assert.equal(
				peanutContainer.register({ name: 'BBB', deps: ['CCC', 'XXX'], def: fetchRhymesTesterClass}),
				null);
			});
		});
		
		describe("Error 3: module not registered when gotten.", function() {
			it(' ', function() {
			assert.equal(
				peanutContainer.get('rhymesServiceNotRegistered'),
				null);
			});
		});
		
		describe("Error 4: registering a factory function.", function() {
			it(' ', function() {
			const testfunc = function (val) {
				this.val = val;
				return;
			}
			assert.equal(
				peanutContainer.register({ name: 'func', deps: [], def: testfunc}),
				null);
			});
		});
		
		describe("Error 5: Missing module information.", function() {
			it(' ', function() {
			const testfunc = function (val) {
				this.val = val;
				return;
			}
			assert.equal(
				peanutContainer.register({ deps: [], def: testfunc}),
				null);
			});
		});
	});
}	
else 
  console.log("container get() failed.");




