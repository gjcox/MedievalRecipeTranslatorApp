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

    #tokeniseText(string) {
        const initSplit = string.split(" ");
        // Remove all non-letter characters, ensuring that historial characters are preserved 
        const words = initSplit.map(word => word.replace(/[^a-zA-ZÞ-]/g, ''));
        return words
    }

    translateText(text) {
        const tokens = this.#tokeniseText(text);
        const translatedTokens =  tokens.map((token) =>  
            this.#glossary[token.toLowerCase()] && this.#glossary[token.toLowerCase()][0].substitution || 
            token );
        return translatedTokens.join(" ")
    }
}

export default new Translator(); 