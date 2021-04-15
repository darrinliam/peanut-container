'use strict';

/**
 * peanutContainer
 *
 * IoC container class that associates dependencies with each module so the deps 
 * can be injected into class constructors when module is retrieved via get() method.
 * 
 **/
class peanutContainer {

    constructor() {
        this.modList = {};
    }

    /**
     * Checks for a cycle in a module's dependency tree. 
     * @param {string} modName
     * @param {string[]} dependencies
     * @return {string[]|null}
     */
    findCycle(modName, deps) {
        let depChain = [];
        let newMod = modName;
        let cycle = (modName, deps) => {
            for (let dep of deps) {
                depChain.push(modName);
                if (newMod === dep) {
                    depChain.push(dep);
                    return depChain; // Cycle found. Return the sequence.
                } else {
                    if ((this.modList[dep]) &&
                        (cycle(dep, this.modList[dep].deps)))
                        return depChain;
                    else
                        depChain.pop(); // backtrack. This dep path is OK.
                }
            }
        };
        if (cycle(modName, deps))
            return depChain;

        return null;
    }

    /** Registers a module with its dependencies. A dependency does not have to 
     *     be registered. Dependencies will be checked for registration in the get()
     *     method.
     *
     *  @param {Object} mod - contains keys for name, dependencies, and constructor func
     *	
     */
    register(mod) {
        try {
            if (this.modList[mod.name] !== undefined) {
                throw new Error(`Module ${mod.name} is already registered.`);
            }
            if (mod.name === undefined || mod.deps === undefined || mod.def === undefined)
                throw new Error(`name, deps, and definition are required for registering a module.`);

            let cyc = this.findCycle(mod.name, mod.deps);
            if (cyc) {
                console.warn(cyc);
                throw new Error(`Dependency cycle found: ${cyc}.`);
            }

            let moduleReg = {
                name: mod.name,
                deps: mod.deps
            };

            if (typeof(mod.def) === 'function') {
                moduleReg.def = mod.def;
            } else { // could be just data / object
                if (mod.deps.length === 0)
                    moduleReg.instance = mod.def;
                else
                    throw new Error(`Module ${mod.name} is not a function and cannot have dependencies.`);
            }
            this.modList[mod.name] = moduleReg;
        } catch (e) {
            console.warn(e);
            this.removeAll();
            return null;
        }
        return this.modList[mod.name];
    }

    /** Creates instance of module and injects dependencies into its constructor.
     *
     *  @param {string} moduleName 
     *	 @return {object} - module instance
     */
    get(moduleName) {
        let moduleReg = this.modList[moduleName];
        try {
            if (moduleReg === undefined)
                throw new Error(`Module ${moduleName} not found`);

            if (!moduleReg.instance) {
                let moduleDeps = [];

                for (let dep of moduleReg.deps) {
                    moduleDeps.push(this.get(dep));
                }
                if (typeof(moduleReg.def) === 'function') { 
					if (/^\s*class\s/.test(moduleReg.def)) 
                      moduleReg.instance = new moduleReg.def(...moduleDeps); // Inject dependencies into constructor.
                    else {
                        try {
                            moduleReg.instance = moduleReg.def.apply(null, moduleDeps); // inject dependencies into factory via params.
                        } catch (e) {
                            // Is function a constructor and thus needs 'new'? Constructor funcs are not currently supported.
                            throw new Error(`Instantiation of function ${moduleName} without 'new' failed. Error: ${e}.`);
                        }
                    }
                }
                if (!moduleReg.instance) {
                    throw new Error(`Instantiation failed for ${moduleName}`);
                }
            }
        } catch (e) {
            console.warn(e);
            return null;
        }
        return moduleReg.instance;
    }

    /** removes all modules from module list.
     *
     */
    removeAll() {
        this.modList = {};
    }
}

module.exports = peanutContainer;
