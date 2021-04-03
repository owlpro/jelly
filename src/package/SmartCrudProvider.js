import React, { Fragment } from 'react'
import DataTable from 'react-data-table-component'
import './Assets/scss/styles.scss'
import Media from './Media/index'

class SmartCrudProvider extends React.Component {
    render() {
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
