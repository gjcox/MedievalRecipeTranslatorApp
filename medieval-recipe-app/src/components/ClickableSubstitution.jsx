import PropTypes from 'prop-types';
import { useState } from 'react';

import GlossaryEntry from './GlossaryEntry.jsx';

export default function ClickableSubstitution({ word, meanings, setGlossaryEntry }) {
    ClickableSubstitution.propTypes = {
        word: PropTypes.string,
        meanings: PropTypes.arrayOf(PropTypes.object),
        setGlossaryEntry: PropTypes.func,
    };
    const defaultSubstitution = meanings[0] && meanings[0].substitution ? meanings[0].substitution : word;
    const [substitution, setSubstitution] = useState(defaultSubstitution);

    const handleClick = () => {
        setGlossaryEntry(<GlossaryEntry
            word={word}
            meanings={meanings}
            setSubstitution={setSubstitution} />);
    };

    return (
        <a href='#' onClick={(e) => { e.preventDefault(); handleClick(); }}>
            {substitution}
        </a>
    );
}
