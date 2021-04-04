'use strict';


const rdict = [
    ['car', 'star', 'bar', 'char', 'mar', 'far'],
    ['stare', 'bear', 'bare', 'wear', 'chair', 'there', 'hair', 'stair', 'err', 'tear'],
    ['coy', 'boy', 'soy', 'ploy', 'bok choy'],
    ['under', 'plunder', 'asunder', 'wonder']
];

/**
 *   fetchRhymesTester
 *
 * Tester class to fetch rhymes from a limited test dictionary, in lieu of a lookup fetcher
 * that would query a real dictionary indexed on the word itself and, most likely, on the
 * rhyming family of words as well.
 * 
 */
class fetchRhymesTesterClass {

    constructor(config) {
        this.config = config;
    }

    connect() {
        console.log('Connected to: ', this.config.server);
    }

    disconnect() {
        console.log('Disconnected from: ', this.config.server);
    }

    fetch(word) {
        console.log('Fetching rhyming words...');
        return this.queryDB(word);
    }

    queryDB(word) {
        let outData = {
            rhyming_words: []
        };

        for (let rrow of rdict) {
            let ind = rrow.indexOf(word);
            if (ind >= 0) {
                let rwords = Array.from(rrow);
                rwords.splice(ind, 1); // remove found word from list.
                outData.rhyming_words = rwords.sort();
                break;
            }
        }
        return outData;
    }
}

module.exports = fetchRhymesTesterClass;
