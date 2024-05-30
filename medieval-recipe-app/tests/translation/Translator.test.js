import { assert, describe, it, vi } from 'vitest';

import { buildGlossary } from '../../src/translation/BuildGlossary';
import Translator from "../../src/translation/Translator";

vi.mock('../../src/translation/BuildGlossary', () => ({
    buildGlossary: vi.fn(),
}));

const MOCK_GLOSSARY = {
    maxMunchLimit: 3,
    "wordone": [{ substitution: "meaning1", note: "note1" }],
    "wordtwo": [{ substitution: "meaning2" }],
    "wordthree": [{ substitution: "meaning1", note: "note1" }],
    "word four": [{ substitution: "meaning4a" }, { substitution: "meaning4b", note: "note4" }],
    "another word four": [{ substitution: "another meaning" }],
};

describe('Translator', async () => {
    buildGlossary.mockResolvedValue(MOCK_GLOSSARY);
    const translator = new Translator();
    await translator.initializeGlossary();

    it('should handle single-word translation', () => {
        const expectedTranslation = ['', { word: "wordone", meanings: [{ substitution: "meaning1", note: "note1" }] }, ''];
        const translation = translator.translateTextToArray('wordone');

        assert.deepEqual(translation, expectedTranslation);
    });

    it('should handle translation of a multi-word phrase', () => {
        const expectedTranslation = ['', { word: "word four", meanings: [{ substitution: "meaning4a" }, { substitution: "meaning4b", note: "note4" }] }, ''];
        const translation = translator.translateTextToArray('word four');

        assert.deepEqual(translation, expectedTranslation);
    });

    it('should prioritise translation of longer phrases', () => {
        const expectedTranslation = ['', { word: "another word four", meanings: [{ substitution: "another meaning" }] }, ''];
        const translation = translator.translateTextToArray('another word four');

        assert.deepEqual(translation, expectedTranslation);
    });

    it('should preserve punctuation', () => {
        const expectedTranslation = [
            'I am partial to ',
            { word: "wordone", meanings: [{ substitution: "meaning1", note: "note1" }] },
            '! And ',
            { word: "word four", meanings: [{ substitution: "meaning4a" }, { substitution: "meaning4b", note: "note4" }] },
            '.',
        ];
        const translation = translator.translateTextToArray('I am partial to wordone! And word four.');

        assert.deepEqual(translation, expectedTranslation);
    });
})
