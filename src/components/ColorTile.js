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
	overflow: hidden;
	flex-wrap: wrap;
	${props => props.clipped && props.showImaginary && imaginaryOverlay};
`
const Mono = styled.div`
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	font-family: monospace;
`

function ColorInfo({ label, children, show, color = 'white' }) {
	if (!show) return null
	return (
		<Mono style={{ color }}>
			{label} : {children}
		</Mono>
	)
}

function ColorTile({
	color,
	base,
	showImaginary,
	colorInfo,
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

	const contrast = {
		black: chromajs.contrast(chromajs('black'), color),
		white: chromajs.contrast(chromajs('white'), color),
	}

	const infoColor = contrast.black > contrast.white ? 'black' : 'white'

	return (
		<Tile
			base={base}
			showImaginary={showImaginary}
			clipped={color.clipped()}
			background={colorStyle}>
			{children}
			{/*colorInfo.contrast && (
				<ContrastContainer>
					{contrastColors.map(c => (
						<Tag color={color.hex()} background={c.hex()}>
							{Math.round(chromajs.contrast(c, color) * 10) / 10}:1
							<br />
						</Tag>
					))}
					<br />
				</ContrastContainer>
					)*/}

			<ColorInfo
				color="black"
				show={colorInfo.contrast && colorInfo.show}
				label="Contrast black">
				{Math.round(contrast.black * 10) / 10}:1
			</ColorInfo>
			<ColorInfo
				color="white"
				show={colorInfo.contrast && colorInfo.show}
				label="Contrast white">
				{Math.round(contrast.white * 10) / 10}:1
			</ColorInfo>
			<ColorInfo
				color={infoColor}
				show={colorInfo.hex && colorInfo.show}
				label="HEX">
				{color.hex()}
			</ColorInfo>
			<ColorInfo
				color={infoColor}
				show={colorInfo.rgb && colorInfo.show}
				label="RGB">
				{color.rgb().join(',')}{' '}
			</ColorInfo>
			<ColorInfo
				color={infoColor}
				show={colorInfo.hsl && colorInfo.show}
				label="HSL">
				{color
					.hsl()
					.map(v => Math.round(v))
					.join(',')}
			</ColorInfo>
			<ColorInfo
				color={infoColor}
				show={colorInfo.lch && colorInfo.show}
				label="LCH">
				{color
					.lch()
					.map(v => Math.round(v))
					.join(',')}{' '}
			</ColorInfo>
		</Tile>
	)
}
export default ColorTile
