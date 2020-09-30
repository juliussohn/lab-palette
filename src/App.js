import React from "react";
import styled from "styled-components";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

import {
  setSteps,
  updateSwatch,
  addSwatch,
  setLightness,
  setImaginary
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
  setImaginary
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
        <label>Lightness</label>
        <Range
          min={0}
          max={100}
          value={options.lightness}
          onChange={(value) => setLightness(value)}
        />
        <input
          type="number"
          id="lightness_min"
          value={options.lightness[0]}
          onChange={(event) =>
            setLightness([event.target.value, options.lightness[1]])
          }
        />
        {" - "}
        <input
          type="number"
          id="lightness_min"
          value={options.lightness[1]}
          onChange={(event) =>
            setLightness([options.lightness[0], event.target.value])
          }
        />
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
    ...state
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { setSteps, updateSwatch, addSwatch, setLightness, setImaginary },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
