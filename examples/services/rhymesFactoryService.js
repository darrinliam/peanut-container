'use strict';

const RhymesFactoryService = function (database) {
  return {
    getRhymes: (word) => {
      database.connect();
      let rhymes = database.fetch(word);
      database.disconnect();
      return rhymes;
    }
  }
}

module.exports = RhymesFactoryService;
