import React, { Fragment } from 'react'
import './Assets/scss/styles.scss'
import Media from './Media/index'

class SmartCrudProvider extends React.Component {
    render() {
        const DataTable = this.props.datatable
        return (
            <Fragment>
                <Media />
                <DataTable data={[{id: 1, title: 'foo'}]} columns={[{selector: 'id', name: 'id'}, {selector: 'title', name: "title"}]} />
                {this.props.children}
            </Fragment>
        )
    }
}

export default SmartCrudProvider
