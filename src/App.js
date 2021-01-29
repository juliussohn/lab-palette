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
	setDisplayP3,
	setColorInfo,
	importStateTree,
} from './actions/actions.js'
import { bindActionCreators } from 'redux'

const Settings = styled.div`
	display: flex;
`

function App({
	state,
	state: { options, swatches, view },
	setSteps,
	updateSwatch,
	addSwatch,
	setLightness,
	setImaginary,
	setChroma,
	setDisplayP3,
	setMirrorValues,
	deleteSwatch,
	moveSwatch,
	setColorInfo,
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
			console.log(e)
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
					<h4>Color info</h4>
					<Toggle
						label={'Show Info'}
						value={view.colorInfo.show}
						onChange={v => {
							setColorInfo({ show: v })
						}}
					/>
					<Toggle
						disabled={!view.colorInfo.show}
						level={1}
						label={'Contrast Ratio'}
						value={view.colorInfo.contrast}
						onChange={v => {
							setColorInfo({ contrast: v })
						}}
					/>
					<Toggle
						disabled={!view.colorInfo.show}
						level={1}
						label={'HEX'}
						value={view.colorInfo.hex}
						onChange={v => {
							setColorInfo({ hex: v })
						}}
					/>
					<Toggle
						disabled={!view.colorInfo.show}
						level={1}
						label={'RGB'}
						value={view.colorInfo.rgb}
						onChange={v => {
							setColorInfo({ rgb: v })
						}}
					/>
					<Toggle
						disabled={!view.colorInfo.show}
						level={1}
						label={'HSL'}
						value={view.colorInfo.hsl}
						onChange={v => {
							setColorInfo({ hsl: v })
						}}
					/>
					<Toggle
						disabled={!view.colorInfo.show}
						level={1}
						label={'LCH'}
						value={view.colorInfo.lch}
						onChange={v => {
							setColorInfo({ lch: v })
						}}
					/>
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
						label={'Display P3 boost'}
						value={options.displayP3}
						onChange={setDisplayP3}
					/>
				</Options>
				<Options>
					<button
						onClick={() => {
							const { swatches, options } = state

							copyTextToClipboard(JSON.stringify({ swatches, options }))
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
			setDisplayP3,
			setMirrorValues,

			deleteSwatch,
			moveSwatch,
			setColorInfo,
			importStateTree,
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
