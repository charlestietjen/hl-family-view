import stripe from 'stripe'


export const initStripe: any = async () => {
    const instance = await new stripe(process.env.STRIPE_API || '')
    // if (instance.errors) return instance.errors
    return instance
}

export const getSubscriptions = async (instance: stripe) => {
    if (!instance) return
    try {
        instance.subscriptions.list(
            { limit: 100 },
            // @ts-ignore
            function (err: any, customers: any) {
                // asynchronously called
                if (err) {
                    console.log(err);
                } else {
                    return customers
                }
            }
        );
    } catch (err) {
        console.log(err)
    }
}

export const findSubscriptionByOrderId = async (instance: stripe, orderId: string) => {
    if (!instance) return
    try {
        const subscription = await instance.subscriptions.search({
            query: `metadata[\'orderId\']:\'${orderId}\'`
        })
        return subscription.data[0]
    }
    catch (err) {
        console.log(err)
    }
}

export const cancelSubscription = async (instance: stripe, subscriptionId: string) => {
    if (!instance) return
    try {
        const subscription = await instance.subscriptions.cancel(subscriptionId)
        return subscription
    }
    catch (err) {
        console.log(err)
    }
}

export const pauseSubscription = async (instance: stripe, subscriptionId: string) => {
    if (!instance) return
    try {
        const subscription = await instance.subscriptions.update(subscriptionId, {
            pause_collection: { behavior: 'void' },
        })
        return subscription
    }
    catch (err) {
        console.log(err)
    }
}

export const resumeSubscription = async (instance: stripe, subscriptionId: string) => {
    if (!instance) return
    try {
        const subscription = await instance.subscriptions.update(subscriptionId, {
            pause_collection: '',
        })
        return subscription
    }
    catch (err) {
        console.log(err)
    }
}