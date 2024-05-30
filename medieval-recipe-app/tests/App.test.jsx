import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from "../src/App.jsx";

describe('App', () => {
    it('renders', () => {
        // just need a test so it doesn't throw an error
        expect(true).toBe(true);

        render(<App/>);

        // This can be useful for debugging, but I have not yet
        // implemented automated integration tests
        // screen.debug();

    });
});