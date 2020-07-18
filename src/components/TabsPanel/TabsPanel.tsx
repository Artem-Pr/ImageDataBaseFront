import React, { useState, useEffect } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import { UploadPage } from '../../pages/UploadPage/UploadPage'
import { SearchPage } from '../../pages/SearchPage/SearchPage'
import api from '../../api/api'

interface TabPanelProps {
	children?: React.ReactNode
	index: any
	value: any
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`nav-tabpanel-${index}`}
			aria-labelledby={`nav-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	)
}

function a11yProps(index: any) {
	return {
		id: `nav-tab-${index}`,
		'aria-controls': `nav-tabpanel-${index}`,
	}
}

interface LinkTabProps {
	label?: string
	href?: string
}

function LinkTab(props: LinkTabProps) {
	return (
		<Tab
			component="a"
			onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
				event.preventDefault()
			}}
			{...props}
		/>
	)
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
}))

export default function NavTabs() {
	const classes = useStyles()
	const [value, setValue] = useState(0)
	const [keywordsList, setKeywordsList] = useState<string[]>([])

	useEffect(() => {
    const getKeywords = async () => {
      try {
        const response = await api.getKeywordsList()
        setKeywordsList(response.data.keywords)
      } catch (error) {
        console.error('Ошибка при получении Keywords: ', error.message)
      }
    }

    !keywordsList.length && getKeywords()
	}, [keywordsList])

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue)
  }

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Tabs
					variant="standard"
					value={value}
					onChange={handleChange}
					aria-label="nav tabs example"
				>
					<LinkTab label="Upload images" {...a11yProps(0)} />
					<LinkTab label="Search images" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<UploadPage keywords={keywordsList} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<SearchPage />
			</TabPanel>
		</div>
	)
}
