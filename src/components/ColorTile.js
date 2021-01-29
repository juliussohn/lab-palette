import React from 'react'
import chromajs from 'chroma-js'
import styled, { css } from 'styled-components'

const imaginaryOverlay = css`
	background-image: repeating-linear-gradient(
		45deg,
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 0) 5px,
		rgba(0, 0, 0, 0.05) 5px,
		rgba(0, 0, 0, 0.05) 10px
	);
`

const Tag = styled.div`
	padding: 2px 4px;
	border-radius: 2px;
	color: ${props => props.background};
	margin-right: 4px;
`
const ContrastContainer = styled.div`
	position: absolute;
	display: flex;
`
const Tile = styled.div`
	position: relative;
	flex: 1;
	padding: 5px;
	color: rgba(0, 0, 0, 0.3);
	background-color: ${props => props.background};

	${props => props.clipped && props.showImaginary && imaginaryOverlay}
`

function ColorTile({
	color,
	base,
	showImaginary,
	showContrast,
	displayP,
	children,
}) {
	const contrastColors = [chromajs('black'), chromajs('white')]
	let colorStyle = color.hex()
	if (displayP) {
		colorStyle = `color(display-p3 ${color.rgb()[0] / 255} ${
			color.rgb()[1] / 255
		} ${color.rgb()[2] / 255})`
	}

	return (
		<Tile
			base={base}
			showImaginary={showImaginary}
			clipped={color.clipped()}
			background={colorStyle}>
			{children}
			{showContrast && (
				<ContrastContainer>
					{contrastColors.map(c => (
						<Tag color={color.hex()} background={c.hex()}>
							{Math.round(chromajs.contrast(c, color) * 10) / 10}:1
							<br />
						</Tag>
					))}
					<br />
				</ContrastContainer>
			)}
			<br />
			{color.hex()} <br />
			H: {Math.round(color.hsl()[0])} <br />
			S: {Math.round(color.hsl()[1] * 100) / 100} <br />
			L: {Math.round(color.hsl()[2] * 100) / 100} <br />
			{color.lch().map(v => (
				<div>{Math.round(v * 100) / 100}</div>
			))}
		</Tile>
	)
}
export default ColorTile
