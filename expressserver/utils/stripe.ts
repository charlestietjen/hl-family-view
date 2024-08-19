import stripe from 'stripe'


export const initStripe: any = async () => {
    const instance = await new stripe(process.env.STRIPE_API || '')
    // if (instance.errors) return instance.errors
    return instance
}

export const getSubscriptions = async (instance : stripe) => {
    if (!instance) return
    instance.subscriptions.list(
        { limit: 100 },
        // @ts-ignore
        function (err: any, customers: any) {
            // asynchronously called
            if (err) {
                console.log(err);
            } else {
                console.log(customers);
            }
        }
    );
}