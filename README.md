# peanut-container

Peanut Container is a Node.js-based IoC container class that associates dependencies with each module so the dependencies can be injected into class constructors when the module is retrieved via the get() method.

Peanut Container currently supports three kinds of module definitions: classes, factory functions, and objects.

## Installation

Clone the repository or download the zip and expand in an empty directory.

## Usage

Require peanutContainer and all of your module definitons. This can all be done in one file, without the need to require dependencies in the files where they are needed:

```
const peanutContainerClass = require('./peanutContainer');
const peanutContainer = new peanutContainerClass();
const myServiceClass = require('./myService);
```


Definitions may be mock definitions for testing purposes.

Register your modules and their dependencies with register(). Each registration requires a name, a dependency list, and a definition (its implementation):
```
peanutContainer.register({ name: 'myService', deps: [dep1, dep2, …], def: myServiceClass });
```
Get the module. The dependency injection into the constructors happens at this time:
```
myApp = peanutContainer.get('myService');
```
## Example

From the directory containing `package.json`, run
```
node ./examples/rhyme
```
`rhyme` is a small rhyme-finding app with a dummy database containing a limited number of rhyme families. Its output will look like:
```
Class:
Connected to: dummyServer
Fetching rhyming words...
Disconnected from:: dummyServer
{ rhyming_words: [ 'asunder', 'plunder', 'under' ] }

Factory Function:
Connected to: dummyServer
Fetching rhyming words...
Disconnected from:: dummyServer
{ rhyming_words: [ 'asunder', 'plunder', 'under' ] }
```
