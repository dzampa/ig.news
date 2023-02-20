import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts'
import { stripe } from '../../services/stripe';

jest.mock('../../services/stripe')

const posts = [
    { slug: 'mu-new-post', title: 'My new post', excerpt: 'Post excerpt', updatedAt: '10 of April' }
]

describe('Posts page', () => {
    it('should render correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
    });

    /*it('loads initial data', async () => {
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
    });*/
});
