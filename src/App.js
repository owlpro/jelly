import React, { Component } from 'react'
import { SmartCrud } from './module'

class App extends Component {
    render() {
        return (
            <div>
                hello world this is package
                <SmartCrud
                    route={'http://localhost:8000/api/v1/products'}
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
