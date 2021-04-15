// Small rhyming app that will find rhyming words based on given word.

'use strict';

const peanutContainerClass = require('../peanutContainer');

const peanutContainer = new peanutContainerClass();

const rootData = require('./rootData');
const fetchRhymesTesterClass = require('./fetchRhymesTester');
const rhymesServiceClass = require('./services/rhymesService');
const rhymesServiceFactory = require('./services/rhymesFactoryService');
const dbMsgData = require('./dbMsg.js');

peanutContainer.register({ name: 'config', deps: [], def: rootData });
peanutContainer.register({ name: 'fetchRhymes', deps: ['config', 'dbMsg'], def: fetchRhymesTesterClass });
peanutContainer.register({ name: 'rhymesService', deps: ['fetchRhymes'], def: rhymesServiceClass});
peanutContainer.register({ name: 'dbMsg', deps: [], def: dbMsgData})

console.log("Class:");
let rhymesApp = peanutContainer.get('rhymesService');

if (rhymesApp)
{
  let rhymes = rhymesApp.getRhymes('wonder');
  console.log(rhymes);
}
else 
  console.log("container get() failed.");
  
peanutContainer.removeAll();
peanutContainer.register({ name: 'config', deps: [], def: rootData });
peanutContainer.register({ name: 'fetchRhymes', deps: ['config', 'dbMsg'], def: fetchRhymesTesterClass });
peanutContainer.register({ name: 'rhymesService', deps: ['fetchRhymes'], def: rhymesServiceFactory});
peanutContainer.register({ name: 'dbMsg', deps: [], def: dbMsgData})

console.log("\nFactory Function:");
rhymesApp = peanutContainer.get('rhymesService');

if (rhymesApp)
{
  let rhymes = rhymesApp.getRhymes('wonder');
  console.log(rhymes);
}
else 
  console.log("container get() failed.");


