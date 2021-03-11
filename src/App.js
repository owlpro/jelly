import React, { Component } from 'react';
import SmartCrud from './SmartCrud';

class App extends Component {
    render() {
        return (
            <div>
                <SmartCrud route={'http://192.168.100.98:8080/api/v4/products'} columns={[]} filters={[]} />
            </div>
        );
    }
}

export default App;
