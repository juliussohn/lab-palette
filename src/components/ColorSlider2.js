import React, { useState, useEffect, useCallback } from 'react'
import chromajs from 'chroma-js'
import styled, { css } from 'styled-components'
import { scaleLinear } from 'd3-scale'
import { clamp } from '../helpers.js'
import { connect } from 'react-redux'
import NumberInput from './NumberInput.js'
import ScaleSelect from './ScaleSelect.js'
import GlobalToggle from './GlobalToggle.js'
import Label from './Label.js'
import { colors } from '../tokens.js'

const Container = styled.div`
	margin-bottom: 10px;
	&:last-child {
		margin-bottom: 0px;
	}
`
const Header = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 0px;
	align-items: center;
`
const Values = styled.div`
	display: flex;
	justify-content: space-between;
`

const Title = styled.div`
	display: flex;
	justify-content: space-between;
`

const getRailGradient = ({ lightness, chroma, hue }) => {
	const getSteps = (count = 6) => {
		let steps = []
		for (var i = 0; i < count * 2; i++) {
			const l = lightness[0] + ((lightness[1] - lightness[0]) / count) * i
			const c = chroma[0] + ((chroma[1] - chroma[0]) / count) * i
			const h = hue[0] + ((hue[1] - hue[0]) / count) * i
			steps.push(chromajs.lch(l, c, h))
		}
		return steps
	}

	const stepCount = 12

	const scale = chromajs.scale(getSteps(stepCount)).domain([0, 360]).mode('lch')
	let steps = scale.classes(stepCount).colors(stepCount)

	const gradientSteps = steps.map(
		(step, i) => `${step} ${(100 / stepCount) * i}%`
	)

	return `linear-gradient(90deg, ${gradientSteps.join(`,`)})`
}

const handleWidth = 16
const railHeight = 10

const Rail = styled.div`
	border: 0.5px solid #e0e0e0;
	position: relative;
	height: ${railHeight + 1}px;
	background: grey;
	border-radius: 5px;
	${props =>
		props.disabled &&
		css`
			pointer-events: none;
			opacity: 1;
		`}
`

const BaseHandle = styled.div`
	height: ${handleWidth}px;
	width: ${handleWidth}px;
	top: 0;
	position: absolute;
	margin-left: -${handleWidth / 2}px;
	margin-top: ${(railHeight - handleWidth) / 2}px;

	cursor: pointer;

	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&:after {
		content: '';
		display: block;
		border: 2px solid black;
		box-sizing: border-box;
		box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.37);
		border-radius: 5px;
		height: 14px;
		width: 8px;
	}
	&:hover {
		&:after {
			border-width: 4px;
			height: 18px;
			width: 12px;
		}
	}
`

const ShadeHandle = styled.div`
	height: ${railHeight}px;
	width: ${railHeight}px;
	border-radius: 100%;
	top: 0;
	background: transparent;
	position: absolute;
	margin-left: -${railHeight / 2}px;
	margin-top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&:after {
		content: '';
		background: ${props =>
			props.shade == 'dark'
				? 'black'
				: props.shade == 'light'
				? 'white'
				: 'grey'};
		display: block;
		height: 6px;
		width: 6px;
		border: 1px solid ${colors.lightBorder};
		box-sizing: border-box;
		border-radius: 22px;
		box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.37);
	}
	&:hover {
		&:after {
			transform: scale(2);
		}
	}
`

function ColorSlider({
	background,
	min,
	max,
	value,
	label,
	onChange,
	useGlobal,
	toggleGlobal,
	state: { options },
}) {
	const [markerPosition, setMarkerPosition] = useState({
		dark: 0,
		base: 0,
		light: 0,
	})
	const [isDragging, setDragging] = useState(false)
	const railRef = React.useRef()
	const [rail, setRail] = useState({ width: 0, left: 0 })
	const [gradient, setGradient] = useState('')

	useEffect(() => {
		setGradient(getRailGradient(background))
	})

	useEffect(() => {
		const handleResize = () => {
			const left = railRef.current.getBoundingClientRect().left
			const width = railRef.current.offsetWidth
			setRail({ left, width })
		}
		window.addEventListener('resize', handleResize)
		handleResize()

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [min, max, railRef])

	useEffect(() => {
		const handleMouseUp = event => setDragging(false)

		const handleMouseMove = ({ clientX }) => {
			const scale = scaleLinear().domain([min, max]).range([0, rail.width])
			const newPos = clientX - rail.left
			let val = scale.invert(newPos)
			if (isDragging == 'base') {
				val = clamp(val, min, max)
			} else {
				val = val - value.base
			}
			handleChange(val, isDragging)
		}

		window.addEventListener('mouseup', handleMouseUp)
		if (isDragging) window.addEventListener('mousemove', handleMouseMove)

		return () => {
			window.removeEventListener('mouseup', handleMouseUp)
			window.removeEventListener('mousemove', handleMouseMove)
		}
	}, [isDragging])

	const handleChange = (val, param) => {
		if (options.mirrorValues) {
			if (param == 'light') {
				onChange({ ...value, light: val, dark: val * -1 })
			} else if (param == 'dark') {
				onChange({ ...value, dark: val, light: val * -1 })
			} else {
				onChange({ ...value, [param]: val })
			}
		} else {
			onChange({ ...value, [param]: val })
		}
	}

	useEffect(() => {
		const scale = scaleLinear().domain([min, max]).range([0, rail.width])
		const base = scale(parseFloat(value.base))
		let dark = scale(parseFloat(value.dark) + parseFloat(value.base))
		let light = scale(parseFloat(value.light) + parseFloat(value.base))

		dark = clamp(dark, 0, rail.width)
		light = clamp(light, 0, rail.width)

		setMarkerPosition({
			base,
			dark,
			light,
		})
	}, [value.base, value.dark, value.light, min, max, rail])

	const handleMouseDown = (e, handle) => {
		setDragging(handle)
	}

	return (
		<Container>
			<Header>
				<Title>
					<Label>{label}</Label>
					{toggleGlobal && (
						<GlobalToggle onClick={toggleGlobal} active={useGlobal} />
					)}
				</Title>

				<Values>
					<ScaleSelect
						disabled={useGlobal}
						onChange={v => onChange({ ...value, scale: v })}
						value={value.scale}></ScaleSelect>
					<NumberInput
						type="number"
						id="hue"
						name="hue"
						value={Math.round(value.dark)}
						onChange={event => handleChange(event.target.value, 'dark')}
						disabled={useGlobal}
					/>
					<NumberInput
						type="number"
						id="hue"
						name="hue"
						value={Math.round(value.base)}
						onChange={event => handleChange(event.target.value, 'base')}
						disabled={useGlobal}
					/>
					<NumberInput
						type="number"
						id="hue"
						name="hue"
						value={Math.round(value.light)}
						onChange={event => handleChange(event.target.value, 'light')}
						disabled={useGlobal}
					/>
				</Values>
			</Header>
			<Rail ref={railRef} style={{ background: gradient }} disabled={useGlobal}>
				{(!useGlobal && (
					<BaseHandle
						style={{ transform: `translateX(${markerPosition.base}px)` }}
						onMouseDown={e => handleMouseDown(e, 'base')}
						className="handle base"
						base={true}></BaseHandle>
				)) || (
					<ShadeHandle
						style={{ transform: `translateX(${markerPosition.base}px)` }}
						onMouseDown={e => handleMouseDown(e, 'base')}
						className="handle base"
						base={true}></ShadeHandle>
				)}
				<ShadeHandle
					shade={'dark'}
					style={{ transform: `translateX(${markerPosition.dark}px)` }}
					onMouseDown={e => handleMouseDown(e, 'dark')}
					className="handle base"></ShadeHandle>
				<ShadeHandle
					shade={'light'}
					style={{ transform: `translateX(${markerPosition.light}px)` }}
					onMouseDown={e => handleMouseDown(e, 'light')}
					className="handle base"></ShadeHandle>
			</Rail>
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		...state,
	}
}

export default connect(mapStateToProps, null)(ColorSlider)
