import React, { Component } from 'react';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

class NoDataComponent extends Component {
    render() {
        return (
            <div className="dt_notfound_data">
                <span className="dt_notfound_text_wrapper">{this.props.title}</span>
                <span className="dt_notfound_icon_wrapper"><InfoRoundedIcon /></span>
            </div>
        )
    }
}

export default NoDataComponent;