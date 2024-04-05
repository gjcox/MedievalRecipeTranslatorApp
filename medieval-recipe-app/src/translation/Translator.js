function buildGlossary() {
    const URL = (import.meta.env.BASE_URL + 'glossary.jsonl')
    return new Promise((resolve, reject) => {
        fetch(URL)
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

function translationListToString(translationArray) {
    const translation = translationArray.map(x => {
        if (typeof x === "string") {
            return x;
        } else {
            return x.meanings[0].substitution || x.word;
        }
    }).join("");
    return capitalizeSentences(translation);
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
        return translationListToString(this.translateTextToArray(text));
    }

    translateTextToArray(text) {
        /* If there are no substitutions to make, output will not change.
         * If there are, then it will be a mixed array of strings and 
         * {word, meanings} objects. */
        const output = [text.slice()];

        for (let munchSize = this.#maxMunchLimit; munchSize > 0; munchSize--) {
            const munchRegExp = RegExp(`${word}(\\s+${word}){${munchSize - 1}}`, 'g');
            const splices = [];
            output.forEach((element, i) => {
                if (typeof (element) === "string") {
                    const newElement = [];
                    let match;
                    let prevEnd = 0;
                    // find all phrases of |munchSize| words 
                    while ((match = munchRegExp.exec(element)) !== null) {
                        let entry;
                        // find substitutions to make 
                        if ((entry = this.#glossary[match[0].toLowerCase()])) {
                            const [start, end] = [match.index, munchRegExp.lastIndex]
                            // add the text between substitutions 
                            newElement.push(element.slice(prevEnd, start));

                            /* add the glossary entry of a word or phrase to be 
                             * substituted */
                            newElement.push({ word: match[0], meanings: entry });
                            prevEnd = end;
                        }
                    }
                    // add any text after the last substitution
                    newElement.push(element.slice(prevEnd));

                    // add the substitution to the queue 
                    splices.push({ i, newElement })
                }

            });

            // perform the substitutions of source phrases of |munchSize| words 
            let offset = 0;
            for (let { i, newElement } of splices) {
                output.splice(i + offset, 1, ...newElement);
                offset += newElement.length - 1;
            }
        }
        return output;
    }




}

export default new Translator(); 