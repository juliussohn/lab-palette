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

export function fallbackCopyTextToClipboard(text) {
	var textArea = document.createElement('textarea')
	textArea.value = text

	// Avoid scrolling to bottom
	textArea.style.top = '0'
	textArea.style.left = '0'
	textArea.style.position = 'fixed'

	document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()

	try {
		var successful = document.execCommand('copy')
		var msg = successful ? 'successful' : 'unsuccessful'
		console.log('Fallback: Copying text command was ' + msg)
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err)
	}

	document.body.removeChild(textArea)
}
export function copyTextToClipboard(text) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text)
		return
	}
	navigator.clipboard.writeText(text).then(
		function () {
			console.log('Async: Copying to clipboard was successful!')
		},
		function (err) {
			console.error('Async: Could not copy text: ', err)
		}
	)
}
