// Small rhyming app that will find rhyming words based on given word.

'use strict';

const peanutContainerClass = require('../peanutContainer');

const peanutContainer = new peanutContainerClass();

const rootData = require('./rootData');
const fetchRhymesTesterClass = require('./fetchRhymesTester');
const rhymesServiceClass = require('./services/rhymesService');
const dbMsgData = require('./dbMsg.js');

peanutContainer.register({ name: 'config', deps: [], def: rootData });
peanutContainer.register({ name: 'fetchRhymes', deps: ['config', 'dbMsg'], def: fetchRhymesTesterClass });
peanutContainer.register({ name: 'rhymesService', deps: ['fetchRhymes'], def: rhymesServiceClass});
peanutContainer.register({ name: 'dbMsg', deps: [], def: dbMsgData})

let rhymesApp = peanutContainer.get('rhymesService');

if (rhymesApp)
{
  let rhymes = rhymesApp.getRhymes('wonder');
  console.log(rhymes);
}
else 
  console.log("container get() failed.");
  

