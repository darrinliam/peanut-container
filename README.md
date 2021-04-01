# peanut-container
Peanut Container

This is a Node.js-based IoC container class that associates dependencies with each module so the deps can be injected into class constructors when module is retrieved via get() method. 

Peanut Container currently supports two kinds of module definitions: classes and objects.

Installation
------------

Download the zip and expand in an empty directory.

Usage
-----  
Require peanutContainer and all module definitons:

  const peanutContainerClass = require('../peanutContainer');

  const peanutContainer = new peanutContainerClass();

  const myServiceClass = require('./myService);


definitions may be mock definitions for testing purposes.


Register your modules and their dependencies with register(). Each restration requires a name, a dependency list, and a definition (implementation):
 
  peanutContainer.register({ name: 'myService', deps: [dep1, dep2, …], def: myServiceClass });


Get the module. The dependency injection into the constructors happen at this time.

  myApp = peanutContainer.get('myService');

Example
-------
From the directory containing package.json, run

  node ./examples/rhyme

rhyme is a small rhyme-finding app with a dummy database containing a limited number of rhyme families. Its output will look like:


Connected to:  dummyServer

Fetching rhyming words...

Disconnected from:  dummyServer

{ rhyming_words: [ 'asunder', 'plunder', 'under' ] }





