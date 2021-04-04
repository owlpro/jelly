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
                            selector: 'key',
                            label: 'key',
                            type: 'text',
                            col: 6
                        },
                        {
                            selector: 'title',
                            label: 'title',
                            type: 'text',
                            col: 6
                        },
                        {
                            selector: 'subtitle',
                            label: 'subtitle',
                            type: 'text',
                            col: 12
                        },
                        {
                            selector: 'description',
                            label: 'description',
                            type: 'textarea',
                            col: 12
                        },
                        {
                            selector: 'amount',
                            label: 'amount',
                            type: 'number',
                            col: 12
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
                    ]}
                    filters={[]}
                />
            </div>
        )
    }
}

export default App
