import React from "react";
import chromajs from "chroma-js";
import Slider, { Range } from "rc-slider";

const getHueGradient = (lightness, chroma, hue) => {
  const getSteps = (count = 6) => {
    let steps = [];
    for (var i = 0; i < count; i++) {
      const l = lightness[0] + ((lightness[1] - lightness[0]) / count) * i;
      const c = chroma[0] + ((chroma[1] - chroma[0]) / count) * i;
      const h = hue[0] + ((hue[1] - hue[0]) / count) * i;
      steps.push(chromajs.lch(l, c, h));
    }
    return steps;
  };

  const stepCount = 6;

  const scale = chromajs
    .scale(getSteps(stepCount))
    .domain([0, 360])
    .mode("lch");
  let steps = scale.classes(stepCount).colors(stepCount);

  const gradientSteps = steps.map(
    (step, i) => `${step} ${(100 / stepCount) * i}%`
  );

  return `linear-gradient(90deg, ${gradientSteps.join(`,`)})`;
};
function ColorSlider(props) {
  /*
  
    hue={[0, 360]}
      chroma={[0, 150]}
      lightness={[0, 150]}
   */
  return (
    <Range
      {...props}
      railStyle={{
        backgroundImage: getHueGradient(
          props.lightness,
          props.chroma,
          props.hue
        ),
        height: 10
      }}
      trackStyle={[
        {
          backgroundColor: "transparent",
          height: 16,
          marginTop: -3,
          border: `3px solid`,
          borderRadius: 3
        }
      ]}
    />
  );
}

export default ColorSlider;
