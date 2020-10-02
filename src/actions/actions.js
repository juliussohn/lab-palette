export const addSwatch = () => ({
	type: 'ADD_SWATCH',
})

export const setSteps = steps => ({
	type: 'SET_STEPS',
	steps,
})

export const updateSwatch = (index, swatch) => ({
	type: 'UPDATE_SWATCH',
	index,
	swatch,
})

export const setLightness = lightness => ({
	type: 'SET_LIGHTNESS',
	lightness,
})

export const setChroma = chroma => ({
	type: 'SET_CHROMA',
	chroma,
})

export const setImaginary = imaginary => ({
	type: 'SET_IMAGINARY',
	imaginary,
})

export const setShowContrast = showContrast => ({
	type: 'SET_SHOW_CONTRAST',
	showContrast,
})

export const setMirrorValues = mirrorValues => ({
	type: 'SET_MIRROR_VALUES',
	mirrorValues,
})

export const deleteSwatch = index => ({
	type: 'DELETE_SWATCH',
	index,
})

export const moveSwatch = (currentIndex, newIndex) => ({
	type: 'MOVE_SWATCH',
	currentIndex,
	newIndex,
})
