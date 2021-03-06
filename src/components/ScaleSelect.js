import React from 'react'
import ranges from '../ranges.js'
import styled from 'styled-components'
import { colors } from '../tokens.js'

const Select = styled.select`
	-webkit-appearance: none;
	-moz-appearance: none;
	font-size: 12px;
	font-weight: normal;
	text-align: center;
	background: none;
	width: 80px;
	padding: 0 8px;
	border: none;
	outline: none;
	border-radius: 0;
	border-style: solid;
	height: 14px;
	line-height: 13px;
	text-align-last: right;

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

function ScaleSelect({ value, onChange, disabled }) {
	return (
		<Select
			disabled={disabled}
			value={value}
			onChange={e => onChange(e.target.value)}>
			{Object.keys(ranges.scales).map(key => (
				<option value={key}>{ranges.scales[key].label}</option>
			))}
		</Select>
	)
}

export default ScaleSelect
