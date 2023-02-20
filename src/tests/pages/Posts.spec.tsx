import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts'
import { stripe } from '../../services/stripe';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/stripe')

const posts = [
    { slug: 'mu-new-post', title: 'My new post', excerpt: 'Post excerpt', updatedAt: '10 de April de 2021' }
];

jest.mock('../../services/prismic');

describe('Posts page', () => {
    it('should render correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
    });

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getAllByType: jest.fn().mockResolvedValueOnce([
                {
                    uid: 'new-uuid',
                    data: {
                        title: [
                            { type: 'heading', text: 'new-data-title' }
                        ],
                        content: [
                            { type: 'paragraph', text: 'new-content' }
                        ]
                    },
                    last_publication_date: '04-01-2021'
                }
            ]
            )
        } as any
        )

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'new-uuid',
                        title: 'new-data-title',
                        excerpt: 'new-content',
                        'updatedAt': '01 de abril de 2021',
                    }]
                }
            })
        )
    });
});
