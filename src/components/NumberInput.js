import styled from 'styled-components'
import { colors } from '../tokens.js'
export default styled.input`
	font-size: 12px;
	font-weight: normal;
	text-align: center;
	background: none;
	width: 22px;
	height: 14px;
	padding: 0;
	border: none;
	outline: none;
	border-radius: 0;
	border-style: solid;

	border-top-width: 1px;
	border-bottom-width: 1px;
	border-left-width: 0px;
	border-right-width: 1px;

	border-color: transparent;
	border-right-color: ${colors.lightBorder};

	&:first-child {
		border-left-width: 1px;
	}
	&:last-child {
		border-right-width: 1px;
		border-right-color: transparent;
	}

	&:hover:not(:disabled),
	&:focus {
		border-top-color: ${colors.lightBorder};
		border-bottom-color: ${colors.lightBorder};
		&:last-child {
			border-right-color: ${colors.lightBorder};
		}
		&:first-child {
			border-left-color: ${colors.lightBorder};
		}
	}
	&:disabled {
		color: ${colors.lightBorder};
	}
`
