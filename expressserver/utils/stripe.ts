import stripe from 'stripe'



// export const initStripe: any = async () => {
//     const stripeInstance = await new stripe(process.env.STRIPE_API || '')
//     stripeInstance.customers.list(
//         { limit: 3 },
//         function (err: any, customers: any) {
//             // asynchronously called
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(customers);
//             }
//         }
//     );
//     return stripeInstance.errors
// }