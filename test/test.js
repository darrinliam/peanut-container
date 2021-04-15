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
                assert.deepStrictEqual(rhymesApp.getRhymes('wonder'), { rhyming_words: [ 'asunder', 'plunder', 'under' ] });
            });
        });
        
        describe("OK 2: rhymes for 'pterodactyl'. No rhymes found.", function() {
            it(' ', function() {
                assert.deepStrictEqual(rhymesApp.getRhymes('pterodactyl'), { rhyming_words: [] });
            });
        });
    });
    
    
    describe('Error tests.', function() {
        describe("Error 1: circular dependency (self).", function() {
            it(' ', function() {
              assert.strictEqual(
                peanutContainer.register({ name: 'ABC', deps: ['XXX', 'ABC'], def: fetchRhymesTesterClass}),
                null);
            });
        });
        
        describe("Error 2: circular dependency (3-way).", function() {
            it(' ', function() {
              peanutContainer.register({ name: 'XXX', deps: ['qqq', 'AAA'], def: fetchRhymesTesterClass});
              peanutContainer.register({ name: 'AAA', deps: ['BBB'], def: fetchRhymesTesterClass});
              assert.strictEqual(
                peanutContainer.register({ name: 'BBB', deps: ['CCC', 'XXX'], def: fetchRhymesTesterClass}),
                null);
            });
        });
        
        describe("Error 3: module not registered when gotten.", function() {
            it(' ', function() {
              assert.strictEqual(
                peanutContainer.get('rhymesServiceNotRegistered'),
                null);
            });
        });
        
        describe("Error 4: registering a constructor function.", function() {
            it(' ', function() {
              const testfunc = function (val) {
                this.val = val;
              }
              peanutContainer.register({ name: 'constructorFunc', deps: [], def: testfunc}),
              assert.strictEqual(
                peanutContainer.get('constructorFunc'),
                null);
            });
        });
        
        describe("Error 5: Missing module information.", function() {
            it(' ', function() {
              const testfunc = function () {
              return { };
            }
            assert.strictEqual(
              peanutContainer.register({ deps: [], def: testfunc}),
              null);
            });
        });

        describe("Error 6: Object cannot have dependencies.", function() {
            it(' ', function() {
              assert.strictEqual(
                peanutContainer.register({ name: 'configBad',  deps: ['AAA'], def: rootData}),
                null);
            });
        });

        describe("Error 7: Module already registered.", function() {
            it(' ', function() {
              peanutContainer.register({ name: 'fetchRhymes', deps: ['config', 'fetchMsg'], def: fetchRhymesTesterClass });
            
              assert.strictEqual(
                peanutContainer.register({ name: 'fetchRhymes', deps: ['config', 'fetchMsg'], def: fetchRhymesTesterClass }),
                null);
            });
        });

        describe("Error 8: module instantiation failed", function() {
            it(' ', function() {
              peanutContainer.register({ name: 'a_null', deps: [], def: null});
            
              assert.strictEqual(
                peanutContainer.get('a_null'),
                null);
            });
        });
    });
}    
else 
  console.log("container get() failed.");




