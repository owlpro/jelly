import React, { Component } from 'react'
import { create } from 'jss'
import rtl from 'jss-rtl'
import { StylesProvider, jssPreset, createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import { connect } from 'react-redux'

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
    input: {
        height: 38,
        fontSize: 14,
    },
    button: {
        height: 38,
    },
    direction: 'rtl',
    typography: {
        fontSize: 14,
    },
})
const jss = create({
    insertionPoint: 'jss-insertion-point',
    plugins: [...jssPreset().plugins, rtl()],
})

class Rtl extends Component {
    theme
    jss

    UNSAFE_componentWillMount() {
        console.log(this.props.theme)
        document.head.innerHTML = '<!-- jss-insertion-point -->' + document.head.innerHTML

        if (this.props.theme) {
            this.theme = this.props.theme
        } else {
            this.theme = createMuiTheme({
                palette: {
                    primary: blue,
                },
                input: {
                    height: 38,
                    fontSize: 14,
                },
                button: {
                    height: 38,
                },
                direction: 'rtl',
                typography: {
                    fontSize: 14,
                },
            })
        }
        this.jss = create({
            insertionPoint: 'jss-insertion-point',
            plugins: [...jssPreset().plugins, rtl()],
        })
    }

    render() {
        return (
            <StylesProvider jss={this.jss}>
                <ThemeProvider theme={this.theme}>
                    <div dir="rtl">{this.props.children}</div>
                </ThemeProvider>
            </StylesProvider>
        )
    }
}

const mapStateToProps = (state) => ({
    theme: state.smartcrud.config.theme,
})

export default connect(mapStateToProps)(Rtl)
