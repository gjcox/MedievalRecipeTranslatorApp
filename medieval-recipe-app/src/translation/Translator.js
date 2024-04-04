function buildGlossary() {
    return new Promise((resolve, reject) => {
        fetch('data/glossary.jsonl')
            .then(response => response.text())
            .then(text => {
                const glossary = {};
                // Split the glossary file into lines
                const lines = text.trim().split('\n');

                // Parse each line as JSON and add an entry to the glossary
                const entries = lines.map(line => JSON.parse(line));
                entries.forEach(entry => {
                    glossary[entry.plaintext] = entry.meanings
                });

                resolve(glossary);
            })
            .catch(error => {
                const msg = 'Error reading JSONL file:' + error;
                console.error(msg);
                reject(msg);
            });
    });
}

class Translator {
    #glossary;

    constructor() {
        buildGlossary()
            .then(glossary => {
                this.#glossary = glossary;
            });
    }

    translateText(text) {
        const wordRegExp = RegExp(/[a-zA-ZÞ-]+/g);
        var translation = text.slice(); 
        let match; 
        while ((match = wordRegExp.exec(translation)) !== null) {
            if (this.#glossary[match[0].toLowerCase()]) {
                const substitution = this.#glossary[match[0].toLowerCase()][0].substitution || match[0]; 
                translation = translation.slice(0, match.index) + substitution + translation.slice(wordRegExp.lastIndex);
            }
        }
        return translation; 
    }
}

export default new Translator(); 