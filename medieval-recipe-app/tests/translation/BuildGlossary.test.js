import { describe, it, expect, vi } from 'vitest';

import { buildGlossary } from '../../src/translation/BuildGlossary';
import fetchGlossary from '../../src/translation/FetchGlossary';

// Mock the fetchGlossary function
vi.mock('../../src/translation/FetchGlossary', () => ({
    default: vi.fn(),
}));

describe('buildGlossary', () => {
    it('builds the glossary correctly', async () => {
        const mockGlossary = `
        {"plaintext": "word1", "meanings": [{"substitution": "meaning1", "note": "note1"}]}
        {"plaintext": "word2", "meanings": [{"substitution": "meaning2"}]}
        {"plaintext": "word3", "synonymOf": "word1"}
        {"plaintext": "word four", "meanings": [{"substitution": "meaning4a"}, {"substitution": "meaning4b", "note": "note4"}]}
        `;

        fetchGlossary.mockResolvedValue(mockGlossary);

        const glossary = await buildGlossary();

        expect(glossary).toEqual({
            maxMunchLimit: 2,
            word1: [{substitution: "meaning1", note: "note1"}],
            word2: [{substitution: "meaning2"}],
            word3: [{substitution: "meaning1", note: "note1"}],
            "word four": [{substitution: "meaning4a"}, {substitution: "meaning4b", note: "note4"}],
        });
    });

    it('handles errors correctly', async () => {
        fetchGlossary.mockRejectedValue(new Error('Failed to fetch'));

        await expect(buildGlossary()).rejects.toThrow('Error reading JSONL file: Error: Failed to fetch');
    });
});