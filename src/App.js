import React, { Component } from 'react'
import { SmartCrud } from './module'

class App extends Component {
    render() {
        return (
            <div>
                hello world this is package
                <SmartCrud
                    route={'http://localhost:8000/api/v1/products'}
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
                            title: 'key',
                        },
                        {
                            selector: 'title',
                            label: 'title',
                        },
                        {
                            selector: 'subtitle',
                            label: 'subtitle',
                        },
                        {
                            selector: 'description',
                            label: 'description',
                        },
                        {
                            selector: 'amount',
                            label: 'amount',
                        },
                    ]}
                    filters={[]}
                />
            </div>
        )
    }
}

export default App
