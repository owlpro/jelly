export default [
    {
        name: 'نام',
        selector: 'title',
        sortableFilter: true,
        isDefaultSort: 'desc',
        grow: 2,
    },
    {
        name: 'بانک',
        selector: 'bank.name',
        sortable: false,
        grow: 1,
    },
    {
        name: 'سریال',
        selector: 'serial',
        sortable: false,
        grow: 2,
    },
    {
        name: 'ترمینال',
        selector: 'terminal_id',
        sortable: false,
        grow: 2,
    },
    {
        name: 'IMEI',
        selector: 'imei',
        sortable: false,
        grow: 3,
    },
    {
        name: 'تاریخ',
        selector: 'created_at',
        sortableFilter: true,
        isDefaultSort: 'desc',
    },
]
