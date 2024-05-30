import  fetchGlossary from "./FetchGlossary";

export async function buildGlossary() {
    try {
        const text = await fetchGlossary();
        const glossary = { maxMunchLimit: 0 };

        const lines = text.trim().split('\n');
        const awaitingSynonyms = [];
        const entries = lines.map(line => JSON.parse(line));

        for (const entry of entries) {
            // Add entry to glossary
            glossary[entry.plaintext] = (glossary[entry.plaintext] || []).concat(entry.meanings || []);

            // Track synonyms to be updated later 
            if (Object.prototype.hasOwnProperty.call(entry, 'synonymOf')) {
                awaitingSynonyms.push(entry);
            }
            
            // Track the longest phrase length in the glossary, to be used in translation 
            const nPlaintextWords = entry.plaintext.split(" ").length;
            if (nPlaintextWords > glossary.maxMunchLimit) {
                glossary.maxMunchLimit = nPlaintextWords;
            }
        }

        // Add missing meanings for synonym entries 
        for (const synonymEntry of awaitingSynonyms) {
            if (!glossary[synonymEntry.synonymOf]) {
                console.warn(`${synonymEntry.plaintext} expected to be a synonym of ${synonymEntry.synonymOf}, but that is not in the glossary.`);
            } else {
                glossary[synonymEntry.plaintext] = (glossary[synonymEntry.plaintext] || []).concat(glossary[synonymEntry.synonymOf] || []);
            }
        }

        return glossary;
    } catch (error) {
        const msg = 'Error reading JSONL file: ' + error;
        throw new Error(msg);
    }
}