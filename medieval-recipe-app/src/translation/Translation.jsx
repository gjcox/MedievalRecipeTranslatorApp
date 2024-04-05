import PropTypes from 'prop-types';

function ClickableSubstitution({ word, meanings }) {
    ClickableSubstitution.propTypes = {
        word: PropTypes.string,
        meanings: PropTypes.arrayOf(PropTypes.object),
    }
    const handleClick = () => {
        // TODO implement something better
        console.log(`${word} -> ${meanings[0].substitution}`);
    }

    return <a
        href='#'
        onClick={(e) => { e.preventDefault(); handleClick(); }}
    >
        {meanings[0].substitution}
    </a>
}

export default function Translation({ translationArray }) {
    Translation.propTypes = {
        translationArray: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    }

    const gridItems = translationArray.map((x, i) => {
        if (typeof x === "string") {
            return x;
        } else {
            const { start, end, word, meanings } = x;
            return (
                <ClickableSubstitution
                    key={i}
                    start={start}
                    end={end}
                    word={word}
                    meanings={meanings}
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