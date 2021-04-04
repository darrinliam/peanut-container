class RhymesService {

	constructor(database) {
		this.database = database;
	}

	getRhymes(word) {
		this.database.connect();
		let rhymes = this.database.fetch(word);
		this.database.disconnect();
		return rhymes;
    }
}

module.exports = RhymesService;
