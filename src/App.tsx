import React from 'react'
import { AppWrapper } from './components/AppWrapper/AppWrapper'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import pink from '@material-ui/core/colors/pink'
import { blue } from '@material-ui/core/colors'

const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: pink,
	},
})

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<AppWrapper />
			</ThemeProvider>
		</div>
	)
}

export default App
