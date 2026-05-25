import { Injectable } from "@nestjs/common";
import Stripe from 'stripe'; // Importação como default

@Injectable()
export class StripeService {
    // Se o erro TS2709 persistir, use 'Stripe' mas garanta que o import acima está correto
    private stripe: InstanceType<typeof Stripe>;

    constructor() {
        const apiKey = process.env.STRIPE_SECRET_KEY || '';

        this.stripe = new Stripe(apiKey, {
            apiVersion: '2023-10-16' as any,
        });
    }

    async createCustomer(email: string) {
        return this.stripe.customers.create({ email });
    }
}