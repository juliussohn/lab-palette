import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'
import ColorSlider from './components/ColorSlider2'
import { connect } from 'react-redux'
import Swatch from './components/Swatch'
import Toggle from './components/Toggle'
import { Options, Input } from './components/containers.js'
import { copyTextToClipboard } from './helpers.js'
import './styles.scss'
import {
	setSteps,
	updateSwatch,
	addSwatch,
	setLightness,
	setChroma,
	setImaginary,
	setMirrorValues,
	deleteSwatch,
	moveSwatch,
	setShowContrast,
	importStateTree,
} from './actions/actions.js'
import { bindActionCreators } from 'redux'

const Settings = styled.div`
	display: flex;
`

function App({
	state,
	state: { options, swatches },
	setSteps,
	updateSwatch,
	addSwatch,
	setLightness,
	setImaginary,
	setChroma,

	setMirrorValues,
	deleteSwatch,
	moveSwatch,
	setShowContrast,
	importStateTree,
}) {
	useEffect(() => {
		//addSwatch()
		//	addSwatch()
		//addSwatch()
		//addSwatch()
	}, [])
	const [importState, setImportState] = useState('')

	const loadImportState = json => {
		try {
			const tree = JSON.parse(json)
			console.log(tree)
			importStateTree(tree)
		} catch (e) {
			console.log('nope')
		}
	}
	return (
		<div className="App">
			<Settings>
				<Options>
					{options.globalChroma && (
						<ColorSlider
							label={'Global Chroma'}
							background={{
								hue: [40, 40],
								chroma: [0, 150],
								lightness: [50, 70],
							}}
							min={0}
							max={150}
							value={options.chroma}
							onChange={value => setChroma(value)}
						/>
					)}
					{options.globalLightness && (
						<ColorSlider
							label={'Global Lightness'}
							background={{
								hue: [270, 270],
								chroma: [0, 0],
								lightness: [0, 70],
							}}
							min={0}
							max={150}
							value={options.lightness}
							onChange={value => setLightness(value)}
						/>
					)}
				</Options>
				<Options>
					<label>Steps</label>
					<Input
						type="number"
						id="steps"
						value={options.steps}
						onChange={event => setSteps(event.target.value)}
					/>
					<br />

					<Toggle
						label={'Mirror Values'}
						value={options.mirrorValues}
						onChange={setMirrorValues}
					/>
					<Toggle
						label={'Highlight Imaginary Colors'}
						value={options.showImaginary}
						onChange={setImaginary}
					/>
					<Toggle
						label={'Show Contrast'}
						value={options.showContrast}
						onChange={setShowContrast}
					/>
				</Options>
				<Options>
					<button
						onClick={() => {
							copyTextToClipboard(JSON.stringify(state))
						}}>
						Export
					</button>

					<br />
					<input
						value={importState}
						onChange={e => {
							setImportState(e.target.value)
						}}
						type="text"
					/>
					<button
						onClick={() => {
							loadImportState(importState)
						}}>
						Import
					</button>
				</Options>
			</Settings>

			<hr />
			{swatches.map((swatch, i) => (
				<Swatch
					key={`swatch_${i}`}
					onChange={swatch => updateSwatch(i, swatch)}
					onDelete={() => deleteSwatch(i)}
					onMoveUp={() => moveSwatch(i, i > 1 ? i - 1 : 0)}
					onMoveDown={() =>
						moveSwatch(i, i < swatches.length - 1 ? i + 1 : swatches.length - 1)
					}
					name={swatch.name}
					hue={swatch.hue}
					chroma={swatch.chroma}
					lightness={swatch.lightness}
				/>
			))}
			<div style={{ padding: 15 }}>
				<button onClick={addSwatch}>Add Swatch</button>
			</div>
		</div>
	)
}
const mapStateToProps = state => {
	return {
		...state,
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			setSteps,
			updateSwatch,
			addSwatch,
			setLightness,
			setImaginary,
			setChroma,

			setMirrorValues,

			deleteSwatch,
			moveSwatch,
			setShowContrast,
			importStateTree,
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
