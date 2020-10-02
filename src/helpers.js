import ranges from './ranges'
import chromajs from 'chroma-js'

export function clamp(num, min, max) {
	num = parseFloat(num)
	min = parseFloat(min)
	max = parseFloat(max)
	return num <= min ? min : num >= max ? max : num
}

export function getSwatchColors(hue, chroma, lightness, steps) {
	const domain = [-1 * steps, 0, steps]

	const lightnessBase = parseFloat(lightness.base)
	const lightnessDark = clamp(
		lightnessBase + parseFloat(lightness.dark),
		ranges.lightness[0],
		ranges.lightness[1]
	)
	const lightnessLight = clamp(
		lightnessBase + parseFloat(lightness.light),
		ranges.lightness[0],
		ranges.lightness[1]
	)

	const lightnessScale = ranges.scales[lightness.scale]
		.scale()
		.domain(domain)
		.range([lightnessDark, lightnessBase, lightnessLight])

	const hueBase = parseFloat(hue.base)
	const hueDark = clamp(
		hueBase + parseFloat(hue.dark),
		ranges.hue[0],
		ranges.hue[1]
	)
	const hueLight = clamp(
		hueBase + parseFloat(hue.light),
		ranges.hue[0],
		ranges.hue[1]
	)

	const hueScale = ranges.scales[hue.scale]
		.scale()
		.domain(domain)
		.range([hueDark, hueBase, hueLight])

	const chromaBase = parseFloat(chroma.base)
	const chromaDark = clamp(
		chromaBase + parseFloat(chroma.dark),
		ranges.chroma[0],
		ranges.chroma[1]
	)
	const chromaLight = clamp(
		chromaBase + parseFloat(chroma.light),
		ranges.chroma[0],
		ranges.chroma[1]
	)

	const chromaScale = ranges.scales[chroma.scale]
		.scale()
		.domain(domain)
		.range([chromaDark, chromaBase, chromaLight])

	let colors = []
	for (let i = -1 * steps; i <= steps; i++) {
		colors.push(
			chromajs.lch(
				Math.round(lightnessScale(i)),
				Math.round(chromaScale(i)),
				Math.round(hueScale(i))
			)
		)
	}
	return colors
}
