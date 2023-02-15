import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/react');
jest.mock('next/router');

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });

        render(<SubscribeButton priceId='fake-priceId' />);

        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('redirects user to sign in when not authenticated', () => {
        const singInMocked = mocked(signIn);
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });
        render(<SubscribeButton priceId='fake-priceId' />);

        const subscriptionButton = screen.getByText('Subscribe now');

        fireEvent.click(subscriptionButton);
        expect(singInMocked).toHaveBeenCalled();
    });

    it('redirects to post when users already has a subscription', () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce({
            data: { user: { name: 'John Doe', email: 'john.doe@gmail.com' }, activeSubscription: 'fake-active-subscription', expires: 'fake-expires' },
            status: 'authenticated',
        });

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)
        render(<SubscribeButton priceId='fake-priceId' />);

        const subscriptionButton = screen.getByText('Subscribe now');

        fireEvent.click(subscriptionButton);
        expect(pushMock).toHaveBeenCalledWith('/posts');
    });
});
