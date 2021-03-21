import React from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@material-ui/core'
import { DialogType } from '../../types'

interface IProps {
	isShowing: boolean
	cancel: () => any
	type: DialogType
	apply?: () => any
	applyButtonText?: string
	cancelButtonText?: string
	title?: string
	children?: JSX.Element | string
}

const Modal = ({
	               isShowing,
	               cancel,
	               apply,
	               applyButtonText,
	               cancelButtonText,
	               type,
	               title,
	               children,
               }: IProps) => {
	return (
		<Dialog
			open={isShowing}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			{title ? <DialogTitle id="alert-dialog-title">{title}</DialogTitle> : ''}
			{children ? (
				<DialogContent>
					{children}
				</DialogContent>
			) : ''}
			<DialogActions>
				{type === 'alert'
					? <Button onClick={cancel} color="secondary">{cancelButtonText || 'cancel'}</Button>
					: ''
				}
				<Button onClick={apply} color="primary" autoFocus>
					{applyButtonText || 'ok'}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default Modal
