export const addSwatch = () => ({
	type: "ADD_SWATCH",
});

export const setSteps = (steps) => ({
	type: "SET_STEPS",
	steps,
});

export const updateSwatch = (index, swatch) => ({
	type: "UPDATE_SWATCH",
	index,
	swatch,
});

export const setLightness = (lightness) => ({
	type: "SET_LIGHTNESS",
	lightness,
});

export const setChroma = (chroma) => ({
	type: "SET_CHROMA",
	chroma,
});

export const setImaginary = (imaginary) => ({
	type: "SET_IMAGINARY",
	imaginary,
});

export const setGlobalChroma = (globalChroma) => ({
	type: "SET_GLOBAL_CHROMA",
	globalChroma,
});
