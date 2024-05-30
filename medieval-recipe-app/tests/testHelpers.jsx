import { screen } from '@testing-library/react';


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
};

export { getByTextContent };
