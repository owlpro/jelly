import React, { Fragment } from 'react'
import './Assets/scss/styles.scss'
import Media from './Media/index'
import { store_configs } from './Redux/action'
import store from './Redux/store'

// import Context from './Helpers/context'
class SmartCrudProvider extends React.Component {
    componentDidMount() {
        let propsData = { ...this.props }
        delete propsData.children
        store.dispatch(store_configs(propsData))
    }

    render() {
        // const DataTable = this.props.datatable
        // const contextData = {
        //     datatable: this.props.datatable,
        // }
        return (
            <Fragment>
                <Media />
                <Fragment>{this.props.children}</Fragment>

                {/* <DataTable
                    data={[{ id: 1, title: 'foo' }]}
                    columns={[
                        { selector: 'id', name: 'id' },
                        { selector: 'title', name: 'title' },
                    ]}
                /> */}
            </Fragment>
        )
    }
}

export default SmartCrudProvider
