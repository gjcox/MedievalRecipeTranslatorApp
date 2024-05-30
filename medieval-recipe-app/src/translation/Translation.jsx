import PropTypes from 'prop-types';

import ClickableSubstitution from './ClickableSubstitution.jsx';

export default function Translation({ now, translationArray, setGlossaryEntry }) {
    Translation.propTypes = {
        now: PropTypes.number,
        translationArray: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
        setGlossaryEntry: PropTypes.func,
    }

    const paragraphContents = translationArray.map((x, i) => {
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
            {paragraphContents}
        </p>
    );
}