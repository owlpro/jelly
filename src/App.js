import React, { Component } from 'react'
import { SmartCrud } from './module'
import columns from './debugging/columns'
import filters from './debugging/filters'
import inputs from './debugging/inputs'
import hasMany from './debugging/hasMany'
class App extends Component {
    render() {
        return (
            <div>
                <SmartCrud
                    title="کاربران"
                    inputs={inputs}
                    // hasMany={hasMany}
                    editable
                    deletable
                    // morphMapKey="Category"
                    // morphMany={['Tags']}
                    route={'/api/v4/terminals'}
                    columns={columns}
                    filters={filters}
                    relations={['bank']}
                    // appendFilter={[['profile.name', '!=', null]]}
                />
            </div>
        )
    }
}

export default App
