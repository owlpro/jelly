import React, { Component } from 'react'
import { SmartCrud } from './module'
import columns from './debugging/columns'
import filters from './debugging/filters'
import inputs from './debugging/inputs'
import hasMany from './debugging/hasMany'
class App extends Component {
    render() {
        return (
                <SmartCrud
                    title="کاربران"
                    inputs={inputs}
                    // hasMany={hasMany}
                    editable
                    deletable
                    // morphMapKey="Category"
                    // morphMany={['Tags']}
                    debug
                    route={'/api/v4/terminals'}
                    columns={columns}
                    filters={filters}
                    relations={['bank']}
                    // appendFilter={[['profile.name', '!=', null]]}
                />
        )
    }
}

export default App
