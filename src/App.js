import React from "react";
import styled from "styled-components";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import ColorSlider from "./components/ColorSlider";

import {
	setSteps,
	updateSwatch,
	addSwatch,
	setLightness,
	setChroma,
	setGlobalChroma,
	setImaginary,
} from "./actions/actions.js";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
import Swatch from "./components/Swatch";
import "./styles.scss";

function App({
	state: { options, swatches },
	setSteps,
	updateSwatch,
	addSwatch,
	setLightness,
	setImaginary,
	setChroma,
	setGlobalChroma,
}) {
	console.log(swatches);
	return (
		<div className="App">
			<div>
				<label>Steps</label>
				<input
					type="number"
					id="steps"
					value={options.steps}
					onChange={(event) => setSteps(event.target.value)}
				/>
				<br />

				<ColorSlider
					label={"Lightness"}
					hue={[270, 270]}
					chroma={[0, 0]}
					lightness={[0, 60]}
					min={0}
					max={100}
					value={options.lightness}
					onChange={(value) => setLightness(value)}
				/>
				<label>Use Global Chroma</label>
				<input
					type="checkbox"
					id="globalChroma"
					checked={options.globalChroma}
					onChange={(event) => setGlobalChroma(event.target.checked)}
				/>
				<br />
				{options.globalChroma && (
					<ColorSlider
						label={"Chroma"}
						hue={[270, 270]}
						chroma={[0, 0]}
						lightness={[0, 60]}
						min={0}
						max={150}
						value={options.chroma}
						onChange={(value) => setChroma(value)}
					/>
				)}
				<label>Imaginary Colors</label>
				<input
					type="checkbox"
					id="imaginary"
					checked={options.showImaginary}
					onChange={(event) => setImaginary(event.target.checked)}
				/>
				<br />
			</div>
			<hr />
			{swatches.map((swatch, i) => (
				<Swatch
					key={`swatch_${i}`}
					onChange={(swatch) => updateSwatch(i, swatch)}
					hue={swatch.hue}
					chroma={swatch.chroma}
				/>
			))}
			<button onClick={addSwatch}>Add</button>
		</div>
	);
}
const mapStateToProps = (state) => {
	return {
		...state,
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(
		{
			setSteps,
			updateSwatch,
			addSwatch,
			setLightness,
			setImaginary,
			setChroma,
			setGlobalChroma,
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
