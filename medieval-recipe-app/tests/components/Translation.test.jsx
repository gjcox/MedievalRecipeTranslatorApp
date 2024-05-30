import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import Translation from '../../src/components/Translation';
import { getByTextContent } from '../testHelpers';

const onClick = vi.fn();

describe('Translation', () => {
    it('should handle an empty translation array gracefully', () => {
        render(<Translation
            now={Date.now()}
            translationArray={[]}
            setGlossaryEntry={onClick}
        />);
    });

    it('should display text in a paragraph', () => {
        const text = 'Some text.';
        render(<Translation
            now={Date.now()}
            translationArray={[text]}
            setGlossaryEntry={onClick}
        />);

        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should integrate a substitution in text', () => {
        const translationArray = [
            'This is a ',
            { word: 'word', meanings: [{ substitution: "substitution" }] },
            '.'
        ];
        render(<Translation
            now={Date.now()}
            translationArray={translationArray}
            setGlossaryEntry={onClick}
        />);

        expect(getByTextContent('This is a substitution.')).toBeInTheDocument();
    });

    it('should use the first substitution by default', () => {
        const translationArray = [
            'This is a ',
            { word: 'word', meanings: [{ substitution: "substitution" }, { substitution: "substi-two-tion" }] },
            '.'
        ];
        render(<Translation
            now={Date.now()}
            translationArray={translationArray}
            setGlossaryEntry={onClick}
        />);

        expect(getByTextContent('This is a substitution.')).toBeInTheDocument();
    });

    it('should integrate multiple substitutions in text', () => {
        const translationArray = [
            'This ',
            { word: 'is', meanings: [{ substitution: "is also" }] },
            ' a ',
            { word: 'word', meanings: [{ substitution: "substitution" }] },
            '.'
        ];
        render(<Translation
            now={Date.now()}
            translationArray={translationArray}
            setGlossaryEntry={onClick}
        />);

        expect(getByTextContent('This is also a substitution.')).toBeInTheDocument();
    });

    it('should not integrate notes in text', () => {
        const translationArray = [
            'This is a ',
            { word: 'word', meanings: [{ substitution: "substitution", note: "note" }] },
            '.'
        ];
        render(<Translation
            now={Date.now()}
            translationArray={translationArray}
            setGlossaryEntry={onClick}
        />);

        expect(getByTextContent('This is a substitution.')).toBeInTheDocument();
    });
});