import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react';
import { mocked } from 'jest-mock';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { stripe } from '../../services/stripe';
import { getPrismicClient } from '../../services/prismic';
import { useRouter } from 'next/router';

jest.mock('../../services/stripe')

const post = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de April de 2021'
};

jest.mock('next-auth/react');
jest.mock('next/router')
jest.mock('../../services/prismic');

describe('Post preview page', () => {
    it('should render correctly', () => {
        const useSessionMock = mocked(useSession)

        useSessionMock.mockReturnValueOnce({ data: null, status: 'unauthenticated' });
        render(<Post post={post} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    });

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMock = mocked(useSession)
        const useRouterMock = mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMock.mockReturnValueOnce({
            data: { user: { name: 'John Doe', email: 'john.doe@gmail.com' }, expires: 'fake-expires' },
            status: 'authenticated',
        });

        useRouterMock.mockReturnValueOnce({
            push: pushMock,
        } as any);

        render(<Post post={post} />)

        expect(screen.getByText('My new post')).toBeInTheDocument()
        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    });

    it('loads initial data', async () => {
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

        const response = await getStaticProps({
            params: {
                slug: 'my-new-slug',
            }
        })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-slug',
                        title: 'new-data-title',
                        content: '<p>new-content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                },
                redirect: 1800,
            })
        )

    })
});
