import { createGlobalStyle } from 'styled-components'

import { ITheme } from '../interfaces/mainInterfaces'

declare module 'styled-components' {
    interface DefaultTheme extends ITheme { }
}

export default createGlobalStyle`
    *{
        font-family: 'Poppins';
        color: ${props => props.theme.text};
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        outline: none;
        border: 0;
    }

    html, body{
        background: url('background.jpg');
        size: cover;
    }

    a{
        text-decoration: none;
        color: ${props => props.theme.link}
    }

    .display-flex{
        flex-direction: row;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        
    }
`
