import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from "../src/App.jsx";
// import GlossaryEntry from '../src/translation/GlossaryEntry.jsx';

describe('App', () => {
    it('renders', () => {
        // just need a test so it doesn't throw an error
        expect(true).toBe(true);

        render(<App/>);

        screen.debug();

    });
});