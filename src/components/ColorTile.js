import React from "react";
import chromajs from "chroma-js";
import styled, { css } from "styled-components";

const imaginaryOverlay = css`
	background-image: repeating-linear-gradient(
		45deg,
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 0) 5px,
		rgba(0, 0, 0, 0.05) 5px,
		rgba(0, 0, 0, 0.05) 10px
	);
`;

const Tag = styled.div`
	padding: 2px 4px;
	border-radius: 2px;
	color: ${(props) => props.background};
	margin-right: 4px;
`;
const ContrastContainer = styled.div`
	position: absolute;
	display: flex;
`;
const Tile = styled.div`
	position: relative;
	flex: 1;
	padding: 5px;
	color: rgba(0, 0, 0, 0.3);
	background-color: ${(props) => props.background};
	${(props) =>
		props.base &&
		css`
			margin: 0 px;
		`}
	${(props) => props.clipped && props.showImaginary && imaginaryOverlay}
`;

function ColorTile({ color, showImaginary, showContrast }) {
	const contrastColors = [chromajs("black"), chromajs("white")];
	return (
		<Tile
			showImaginary={showImaginary}
			clipped={color.clipped()}
			background={color.hex()}
		>
			{showContrast && (
				<ContrastContainer>
					{contrastColors.map((c) => (
						<Tag color={color.hex()} background={c.hex()}>
							{Math.round(chromajs.contrast(c, color) * 10) / 10}:1
						</Tag>
					))}
				</ContrastContainer>
			)}
		</Tile>
	);
}
export default ColorTile;
