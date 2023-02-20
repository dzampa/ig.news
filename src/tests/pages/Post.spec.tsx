import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock';
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { stripe } from '../../services/stripe';
import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/react';

jest.mock('../../services/stripe')

const post = {
    slug: 'mu-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de April de 2021'
};

jest.mock('next-auth/react');
jest.mock('../../services/prismic');

describe('Post page', () => {
    it('should render correctly', () => {
        render(<Post post={post} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    });

    it('redirects user if no subscription found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: {
                slug: 'my-mew-slug'
            },
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining(
                    {
                        destination: '/'
                    }
                )
            })
        )
    });

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'new-data-title' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'new-content' }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);

        const response = await getServerSideProps({
            params: {
                slug: 'my-mew-slug'
            },
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-mew-slug',
                        title: 'new-data-title',
                        content: '<p>new-content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )

    })
});
