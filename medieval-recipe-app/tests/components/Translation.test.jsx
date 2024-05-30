import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import Translation from '../../src/components/Translation';

const onClick = vi.fn();

/**
 * Finds an element based on its text content, allowing for the text to be
 * broken up by multiple elements. 
 * @param {str} text the string to match against.
 * @returns an HTMLElement
 */
const getByTextContent = (text) => {
    return screen.getByText((_, element) => {
        const hasText = element => element.textContent === text;
        const elementHasText = hasText(element);
        const childrenDontHaveText = Array.from(element?.children || []).every(child => !hasText(child));
        return elementHasText && childrenDontHaveText;
    });
}

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