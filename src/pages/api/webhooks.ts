import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false,
    }
}

const relevantEvents = new Set([
    'checkout.session.completed'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST'){
        const buf = await buffer(req);
        const secret = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try{ 
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
        } catch (err) {
            return res.status(400).send(`Webhook erro: ${err.message}`);
        }

        const { type }  = event;

        try{ 
            if (relevantEvents.has(type)) { 
                switch (type) {
                    case 'checkout.session.completed':
                        break;
                    default: 
                        throw new Error(`Unhandled event.`);
                }
            }
        } catch (err) {
            return res.status(400).send(`Webhook handler failed.`);
        }

        res.json({received: true});
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
    }
}