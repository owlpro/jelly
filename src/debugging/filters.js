export default [
    {
        label: 'تاریخ',
        selector: 'created_at',
        type: 'date',
        variant: 'inline',
    },
    {
        label: 'شماره کارت',
        selector: 'card_number',
        type: 'string',
    },
    {
        label: 'شماره موبایل',
        selector: 'mobile',
        type: 'string',
    },
    {
        label: 'مبلغ',
        selector: 'amount',
        type: 'number',
    },
    {
        label: 'امتیاز اعطا شده',
        selector: 'gift',
        type: 'number',
    },
    {
        label: 'امتیاز هزینه شده',
        selector: 'point',
        type: 'number',
    },

    {
        label: 'نوع تراکنش',
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
