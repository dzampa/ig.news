import { render, screen } from '@testing-library/react'
import Home from '../../pages'

jest.mock('next-auth/react');
jest.mock('next/router');

describe('Home page', () => {
    it('should render correctly', () => {
        render(<Home product={{ priceId: 'fake-priceId', amount: 'fake-amount' }} />)

        expect(screen.getByText('for fake-amount month')).toBeInTheDocument()
    });
});
