import PropTypes from 'prop-types';
import { useState } from 'react';

import GlossaryEntry from './GlossaryEntry.jsx';

function ClickableSubstitution({ word, meanings, setGlossaryEntry }) {
    ClickableSubstitution.propTypes = {
        word: PropTypes.string,
        meanings: PropTypes.arrayOf(PropTypes.object),
        setGlossaryEntry: PropTypes.func,
    }
    const [substitution, setSubstitution] = useState(meanings[0].substitution);

    const handleClick = () => {
        setGlossaryEntry(<GlossaryEntry
            word={word}
            meanings={meanings}
            setSubstitution={setSubstitution}
        />);
        console.log(`${word} -> ${meanings[0].substitution}`);
    }

    return (
        <a href='#' onClick={(e) => { e.preventDefault(); handleClick(); }} >
            {substitution}
        </a>
    );
}

export default function Translation({ now, translationArray, setGlossaryEntry }) {
    Translation.propTypes = {
        now: PropTypes.number,
        translationArray: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
        setGlossaryEntry: PropTypes.func,
    }

    const gridItems = translationArray.map((x, i) => {
        if (typeof x === "string") {
            return x;
        } else {
            const { word, meanings } = x;
            return (
                <ClickableSubstitution
                    key={`${now}.${i}`}
                    word={word}
                    meanings={meanings}
                    setGlossaryEntry={setGlossaryEntry}
                />
            );
        }
    })

    return (
        <p>
            {gridItems}
        </p>
    );
}