function buildGlossary() {
    return new Promise((resolve, reject) => {
        fetch('data/glossary.jsonl')
            .then(response => response.text())
            .then(text => {
                const glossary = { maxMunchLimit: 0 };
                // Split the glossary file into lines
                const lines = text.trim().split('\n');

                // Parse each line as JSON and add an entry to the glossary
                const entries = lines.map(line => JSON.parse(line));
                let nWords
                entries.forEach(entry => {
                    glossary[entry.plaintext] = entry.meanings

                    if ((nWords = entry.plaintext.split(" ").length) > glossary.maxMunchLimit) {
                        glossary.maxMunchLimit = nWords;
                    }
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

// the default \w and \b only work for the Latin alphabet, so I have created my own equivalents
const wordChars = "\\wþÞ-";
const wordBoundary =
    `(^(?=[${wordChars}])|` +
    `(?<=[^${wordChars}])(?=[${wordChars}])|` +
    `(?<=[${wordChars}])(?=[^${wordChars}])|` +
    `(?<=[${wordChars}])$)`;
const word = `${wordBoundary}[${wordChars}]+${wordBoundary}`;


class Translator {
    #glossary;
    #maxMunchLimit

    constructor() {
        buildGlossary()
            .then(glossary => {
                this.#glossary = glossary;
                this.#maxMunchLimit = glossary.maxMunchLimit;
                console.log("Glossary built");
            });
    }

    translateText(text) {
        var translation = text.slice();

        for (let munchSize = this.#maxMunchLimit; munchSize > 0; munchSize--) {
            const munchRegExp = RegExp(`${word}(\\s+${word}){${munchSize - 1}}`, 'g');

            let match;
            while ((match = munchRegExp.exec(translation)) !== null) {
                if (this.#glossary[match[0].toLowerCase()]) {
                    const substitution = this.#glossary[match[0].toLowerCase()][0].substitution || match[0];
                    translation = translation.slice(0, match.index) + substitution + translation.slice(munchRegExp.lastIndex);
                    console.log(`"${match[0]}" -> "${substitution}": ${translation}`)
                }
            }
        }

        return translation;
    }
}

export default new Translator(); 