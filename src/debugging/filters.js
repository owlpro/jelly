export default [
    {
        name: 'تاریخ',
        selector: 'created_at',
        type: 'date',
        variant: 'inline',
    },
    {
        name: 'شماره کارت',
        selector: 'card_number',
        type: 'string',
    },
    {
        name: 'شماره موبایل',
        selector: 'mobile',
        type: 'string',
    },
    {
        name: 'مبلغ',
        selector: 'amount',
        type: 'number',
    },
    {
        name: 'امتیاز اعطا شده',
        selector: 'gift',
        type: 'number',
    },
    {
        name: 'امتیاز هزینه شده',
        selector: 'point',
        type: 'number',
    },

    {
        name: 'نوع تراکنش',
        selector: 'payment_type',
        type: 'select',
        items: [
            {
                label: 'پرداخت نقدی',
                value: 'cash',
            },
            {
                label: 'پرداخت با کارت',
                value: 'terminal',
            },
            {
                label: 'پرداخت ترکیبی',
                value: 'multi_payment',
            },
            {
                label: 'تکمیل نشده',
                value: 'incomplete',
            },
        ],
    },
]
