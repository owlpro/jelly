import React from 'react'
import { create } from 'jss'
import rtl from 'jss-rtl'
import { StylesProvider, jssPreset, createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
    input: {
        height: 38,
        fontSize: 14
    },
    button: {
        height: 38
    },
    direction: 'rtl',
    typography: {
        // fontFamily: "Shabnam",
        fontSize: 14,
    },
})
const jss = create({
    insertionPoint: 'jss-insertion-point',
    plugins: [...jssPreset().plugins, rtl()],
    // insertionPoint: 'jss-insertion-point',
})

export function RTL(props) {
    return (
        <StylesProvider jss={jss}>
            <ThemeProvider theme={theme}>
                <div dir="rtl">{props.children}</div>
            </ThemeProvider>
        </StylesProvider>
    )
}
