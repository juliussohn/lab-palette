import React, { useState, useEffect } from 'react'
import ColorSlider from './ColorSlider2'
import ranges from '../ranges'
import { getSwatchColors } from '../helpers.js'
import ColorTile from './ColorTile.js'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { colors } from '../tokens.js'

const Input = styled.input`
	display: flex;
	padding: 4px 0;
	border: none;
	outline: none;
	text-align: left;
	font-size: 14px;
`
const Container = styled.div`
	display: flex;
	width: 100%;
`

const Actions = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`
export const Options = styled.div`
	width: 400px;
	padding: 16px 16px;
	border-bottom: 1px solid ${colors.lightBorder};
`

const ColorRow = styled.div`
	display: flex;
	flex: 1;
`

const GlobalSettings = styled.div`
	display: flex;
`

const GlobalToggle = styled.div`
	padding: 0 3px;
	color: ${props => (props.active ? `blue` : 'lightgrey')};
	font-weight: bold;
	cursor: pointer;
`

function Swatch({
	state: { options, view },
	lightness,
	hue,
	chroma,
	name,
	onChange,
	onDelete,
	onMoveUp,
	onMoveDown,
}) {
	const [colors, setColors] = useState([])

	useEffect(() => {
		console.log(hue, chroma, lightness, options.steps)
		setColors(getSwatchColors(hue, chroma, lightness, options.steps))
	}, [hue, chroma, lightness, options.steps])

	const toggleGlobalChroma = () => {
		const updateChroma = chroma.global ? chroma : options.chroma
		onChange({ chroma: { ...updateChroma, global: !chroma.global } })
	}
	const toggleGlobalLightness = () => {
		const updateLightness = lightness.global ? lightness : options.lightness
		onChange({ lightness: { ...updateLightness, global: !lightness.global } })
	}

	return (
		<Container key={'container'}>
			<Options key={'options'}>
				<div>
					<Input
						type="text"
						id="name"
						name="name"
						value={name}
						onChange={event => onChange({ name: event.target.value })}
						placeholder="Enter a name..."
					/>
				</div>
				<ColorSlider
					label="Hue"
					background={{
						hue: [0, 360],
						chroma: [90, 90],
						lightness: [70, 70],
					}}
					min={ranges.hue[0]}
					max={ranges.hue[1]}
					value={hue}
					onChange={value => onChange({ hue: value })}
				/>
				<ColorSlider
					toggleGlobal={toggleGlobalChroma}
					useGlobal={chroma.global}
					label="Chroma"
					background={{
						hue: [parseInt(hue.base), parseInt(hue.base)],
						chroma: [0, 150],
						lightness: [70, 70],
					}}
					min={ranges.chroma[0]}
					max={ranges.chroma[1]}
					value={chroma}
					onChange={value => onChange({ chroma: value })}
				/>
				<ColorSlider
					useGlobal={lightness.global}
					toggleGlobal={toggleGlobalLightness}
					label="Lightness"
					background={{
						hue: [parseInt(hue.base), parseInt(hue.base)],
						chroma: [60, 60],
						lightness: [0, 70],
					}}
					min={ranges.lightness[0]}
					max={ranges.lightness[1]}
					value={lightness}
					onChange={value => onChange({ lightness: value })}
				/>
			</Options>
			<Actions>
				<button onClick={onDelete}>×</button>
				<button onClick={onMoveUp}>↑</button>
				<button onClick={onMoveDown}>↓</button>
			</Actions>
			<ColorRow>
				{colors.map((color, i) => (
					<ColorTile
						key={i}
						base={i === parseInt(options.steps)}
						color={color}
						showImaginary={view.showImaginary}
						displayP={view.displayP3}
						colorInfo={view.colorInfo}></ColorTile>
				))}
			</ColorRow>
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		...state,
	}
}

export default connect(mapStateToProps, null)(Swatch)
