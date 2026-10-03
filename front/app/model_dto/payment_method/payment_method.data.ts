import type { PaymentMethodDTO } from "./payment_method.dto";


export const paymentMethodData: PaymentMethodDTO[] = [
    {
        value: 'bakong',
        label: 'Bakong',
        image: '/images/bakong.png',
        active: true
    },
    {
        value: 'cutluy',
        label: 'Cutluy',
        image: '/images/bank.png',
        active: true
    },
    {
        value: 'deeplink',
        label: 'Deep Link',
        image: '/images/qr.png',
        active: true
    }
]