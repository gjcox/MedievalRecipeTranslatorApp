import { fireEvent, render, screen } from '@testing-library/react';
import { assert, describe, expect, it, vi } from 'vitest';

import ClickableSubstitution from '../../src/components/ClickableSubstitution';
import { getByTextContent } from '../testHelpers';

const onClick = vi.fn();

describe('ClickableSubstitution', () => {
    it('should display text in a paragraph', () => {
        const substitution = 'substitution';
        render(<ClickableSubstitution
            word={"word"}
            meanings={[{ substitution: substitution }]}
            setGlossaryEntry={onClick}
        />);

        expect(getByTextContent(substitution)).toBeInTheDocument();
    });

    it('should use the first substitution by default', () => {
        const substitution = 'substitution';
        const otherSubstitution = 'another substitution';
        render(<ClickableSubstitution
            word={"word"}
            meanings={[{ substitution: substitution }, { substitution: otherSubstitution }]}
            setGlossaryEntry={onClick}
        />);

        expect(getByTextContent(substitution)).toBeInTheDocument();
        assert.isNull(screen.queryByText(otherSubstitution));
    });

    it('should call "setGlossaryEntry" when clicked', () => {
        const substitution = 'substitution';
        render(<ClickableSubstitution
            word={"word"}
            meanings={[{ substitution: substitution }]}
            setGlossaryEntry={onClick}
        />);
        const links = screen.getAllByRole("link");

        fireEvent.click(links[0])

        expect(onClick).toBeCalledTimes(1);
    });
});