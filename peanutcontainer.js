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
        this.modlist = {};
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
                    if ((this.modlist[dep]) &&
                        (cycle(dep, this.modlist[dep].deps)))
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
            if (this.modlist[mod.name] !== undefined) {
                throw new Error(`Module {mod.name} is already registered.`);
            }
			if (mod.name === undefined || mod.deps === undefined || mod.def === undefined)
			    throw new Error(`name, deps, and definition are required for registering a module.`);

            let cyc = this.findCycle(mod.name, mod.deps);
            if (cyc) {
                console.warn(cyc);
                throw new Error(`Dependency cycle found: ${cyc}.`);
            }

            var moduleReg = {
                name: mod.name,
                deps: mod.deps
            };

            if (typeof(mod.def) === 'function') {
                if (/^\s*class\s+/.test(mod.def))
                    moduleReg.def = mod.def;
                else
                    throw new Error(`Module must be a class: ${mod.name}`);
            } else { // could be just data / object
                if (mod.deps.length == 0)
                    moduleReg.instance = mod.def;
                else
                    throw new Error(`Module ${mod.name} is not a function and cannot have dependencies.`);
            }
            this.modlist[mod.name] = moduleReg;
        } catch (e) {
            console.warn(e);
            this.removeAll();
			return null;
        }
		return this.modlist[mod.name];
    }

    /** Creates instance of module and injects dependencies into its constructor.
     *
     *  @param {string} moduleName 
     *	 @return {object} - module instance
     */
    get(moduleName) {
        try {
            var moduleReg = this.modlist[moduleName];

            if (moduleReg === undefined)
                throw new Error(`Module ${moduleName} not found`);

            if (!moduleReg.instance) {
                let moduleDeps = [];

                for (let dep of moduleReg.deps) {
                    moduleDeps.push(this.get(dep));
                };

                if (typeof(moduleReg.def) === 'function') {
                    // Inject dependencies into constructor.
                    // to do: support factory functions, not just classes
                    moduleReg.instance = new moduleReg.def(moduleDeps[0]);
                } else
                    throw new Error(`Module must be a class: ${moduleName}`);

                if (moduleReg.instance === undefined) {
                    console.warn(`Instantiation failed for ${moduleName}`);
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
        this.modlist = {};
    }
};

module.exports = peanutContainer;
