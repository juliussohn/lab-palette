import React from 'react'
import styled from 'styled-components'
import { colors } from '../tokens.js'

const Container = styled.div`
	cursor: pointer;
	margin-left: 4px;
	height: 14px;
	width: 18px;
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		display: block;
	}
	background: ${props =>
		props.active ? `${colors.activeShade}` : `transparent`};
`
function GlobalToggle({ active, onClick }) {
	return (
		<Container
			title="Uses global values when active"
			active={active}
			onClick={onClick}>
			<img src={`/icons/${active ? 'linked' : 'unlinked'}.svg`} />
		</Container>
	)
}

export default GlobalToggle
