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

// This function was adapted from https://www.geeksforgeeks.org/javascript-program-to-capitalize-the-first-letter-of-every-sentence-in-a-string/. Accessed 04/04/2024.
function capitalizeSentences(text) {
    // Split the text into sentences  
    // using regular expressions 
    const sentences = text.split(/\.|\?|!/);

    // Capitalize the first letter of each sentence 
    const capitalizedSentences = sentences
        // Remove empty sentences 
        .filter(sentence =>
            sentence.trim() !== '')
        .map(sentence =>
            sentence.trim()[0]
                .toUpperCase() +
            sentence.trim().slice(1));

    // Join the sentences back together 
    return capitalizedSentences.join('. ') + (text.trim().slice(-1) == '.' ? '.' : '');
}

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
            const substitutions = [];

            // find substitutions to make 
            let match;
            while ((match = munchRegExp.exec(translation)) !== null) {
                if (this.#glossary[match[0].toLowerCase()]) {
                    const substitution = this.#glossary[match[0].toLowerCase()][0].substitution || match[0];
                    substitutions.push({ start: match.index, end: munchRegExp.lastIndex, word: match[0], sub: substitution })
                }
            }

            // apply substitutions 
            // N.B. substitutions should not be applied within the above while loop 
            let offset = 0;
            for (let { start, end, word, sub } of substitutions) {
                translation = translation.slice(0, start + offset) + sub + translation.slice(end + offset);
                // console.log(`"${word}" -> "${sub}": ${translation}`);
                offset += sub.length - word.length;
            }
        }

        translation = capitalizeSentences(translation);
        return translation;
    }
}

export default new Translator(); 