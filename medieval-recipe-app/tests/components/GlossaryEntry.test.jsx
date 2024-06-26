import { fireEvent, screen, render } from '@testing-library/react';
import { assert, describe, expect, it, vi } from 'vitest';

import { EMPTY_GLOSSARY_ENTRY } from '../../src/constants';
import GlossaryEntry from '../../src/components/GlossaryEntry';

const onClick = vi.fn();

describe('GlossaryEntry', () => {
    it('should have placeholder text if there are no substitutions', () => {
        render(<GlossaryEntry
            word={"testeth"}
            meanings={[]}
            setSubstitution={onClick}
        />);

        screen.getByText(EMPTY_GLOSSARY_ENTRY);
    });
    it('should not have placeholder text if there are substitutions', () => {
        render(<GlossaryEntry
            word={"testeth"}
            meanings={[{ substitution: "test", note: "very important in software developement" }]}
            setSubstitution={onClick}
        />);

        const placeholder = screen.queryByText(EMPTY_GLOSSARY_ENTRY);
        assert.isNull(placeholder, "there should not be placeholder text");
    });
    it('should call "setSubstitution" when a substitution is clicked', () => {
        render(<GlossaryEntry
            word={"testeth"}
            meanings={[{ substitution: "test", note: "very important in software developement" }]}
            setSubstitution={onClick}
        />);
        const links = screen.getAllByRole("link");

        fireEvent.click(links[0])

        expect(onClick).toBeCalledTimes(1);
    });
});