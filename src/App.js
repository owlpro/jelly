import React, { Component } from 'react'
import { SmartCrud } from './module'

class App extends Component {
    render() {
        return (
            <div>
                <SmartCrud
                    route={'http://localhost:8080/api/v4/products'}
                    deletable
                    editable
                    inputs={[
                        {
                            selector: 'image',
                            label: 'image',
                            type: 'image',
                            col: 12,
                        },
                        {
                            selector: 'key',
                            label: 'key',
                            type: 'text',
                            col: 6,
                        },
                        {
                            selector: 'title',
                            label: 'title',
                            type: 'text',
                            col: 6,
                        },
                        {
                            selector: 'subtitle',
                            label: 'subtitle',
                            type: 'text',
                            col: 12,
                        },
                        {
                            selector: 'description',
                            label: 'description',
                            type: 'textarea',
                            col: 12,
                        },
                        {
                            selector: 'amount',
                            label: 'amount',
                            type: 'number',
                            col: 6,
                        },
                        {
                            selector: 'merchant_id',
                            label: 'merchant',
                            type: 'select',
                            options: '/api/v4/merchants?page_size=999',
                            col: 6,
                        },
                    ]}
                    columns={[
                        {
                            selector: 'key',
                            name: 'key',
                        },
                        {
                            selector: 'title',
                            name: 'title',
                            searchable: true,
                        },
                        {
                            selector: 'subtitle',
                            name: 'subtitle',
                        },
                        {
                            selector: 'description',
                            name: 'description',
                        },
                        {
                            selector: 'amount',
                            name: 'amount',
                        },
                        {
                            selector: 'created_at',
                            name: 'created_at',
                            sortableFilter: true,
                            isDefaultSort: 'asc',
                        },
                    ]}
                    filters={[
                        {
                            selector: 'title',
                            label: 'متن',
                            type: 'text',
                        },
                        {
                            selector: 'amount',
                            label: 'مبلغ',
                            type: 'number',
                        },
                        {
                            selector: 'created_at',
                            label: 'تاریخ1',
                            type: 'datetime',
                        },
                        {
                            selector: 'created_at2',
                            label: 'تاریخ2',
                            type: 'date',
                        },
                        {
                            selector: 'created_at3',
                            label: 'تاریخ3',
                            type: 'time',
                        },
                    ]}
                />
            </div>
        )
    }
}

export default App
