import { Grid } from '@mui/material';
import PropTypes from 'prop-types';

const PLACEHOLDER_TEXT = "empty glossary entry - no known meanings";
export { PLACEHOLDER_TEXT };

export default function GlossaryEntry({ word, meanings, setSubstitution }) {
    GlossaryEntry.propTypes = {
        word: PropTypes.string,
        meanings: PropTypes.arrayOf(PropTypes.object),
        setSubstitution: PropTypes.func,
    }

    const subColWidth = 3;
    const meaningItems = meanings.map((m) => (
        <Grid
            container
            key={`${word}.${m.substitution}`}
            className={"meaning"}
        >
            <Grid item xs={subColWidth}>
                <a href="#" onClick={e => { e.preventDefault(); setSubstitution(m.substitution); }}>
                    {m.substitution}
                </a>
            </Grid>
            <Grid item xs={12 - subColWidth}>
                {m.note}
            </Grid>

        </Grid >));

    const noMeanings = <Grid item xs={12}><i>{PLACEHOLDER_TEXT}</i></Grid>;

    return (
        <Grid
            container
            id="GlossaryEntry"
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            <Grid item><h3>{word.toLowerCase()}</h3></Grid>
            {meaningItems.length > 0 ? meaningItems : noMeanings}
        </Grid>
    );
}