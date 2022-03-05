import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeBottomProps {
    priceId: string;
}

export function SubscribeBottom({ priceId }: SubscribeBottomProps) {
    const session = useSession();

    async function handleSubscribe(){
        if (!session.data) {
            signIn('github')
            return;
        }

        try { 
            const response = await api.post('/subscribe')

            const {sessionId} = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({sessionId})
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now       
        </button>
    )
}