import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock';
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe';

jest.mock('next-auth/react');
jest.mock('next/router');

jest.mock('../../services/stripe')

describe('Home page', () => {
    it('should render correctly', () => {
        render(<Home product={{ priceId: 'fake-priceId', amount: 'fake-amount' }} />)

        expect(screen.getByText('for fake-amount month')).toBeInTheDocument()
    });

    it('loads initial data', async () => {
        const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

        retrieveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-pricesId',
            unit_amount: 1000,
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-pricesId',
                        amount: '$10.00'
                    }
                }
            })
        )
    });
});
