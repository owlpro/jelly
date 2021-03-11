import React, {Component} from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

class LoadingList extends Component {
    render(){
        return (
            <div className="loadingList" >
                <span>درحال دریافت اطلاعات ...</span>
               <CircularProgress color="inherit"/>
            </div>
        )
    }
}

export default LoadingList;
