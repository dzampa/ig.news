import styles from './styles.module.scss';

interface SubscribeBottomProps {
    priceId: string;
}

export function SubscribeBottom({ priceId }: SubscribeBottomProps) {
    return (
        <button
            type="button"
            className={styles.subscribeButton}
        >
            Subscribe now       
        </button>
    )
}