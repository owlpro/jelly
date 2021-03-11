import React, { Component, Fragment } from "react";
import Media from "./Media"
class SmartCrudProvider extends Component {
    renderMediaModel = () => {
        return <Media />
    }
    render() {
        return (
            <Fragment>
                {this.renderMediaModel()}
                {this.props.children}
            </Fragment>
        )
    }
}
export default SmartCrudProvider;