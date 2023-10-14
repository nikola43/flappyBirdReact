import styled from 'styled-components'

export const Container = styled.section`
	height: 100vh;
  width: 100vw;

  canvas{
    border: 1px solid ${props => props.theme.main};
    border-radius: 11px;

    /* width: 560px;
    height: 98%; */
  }
`
