import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components'

import { IProviderData } from './interfaces/mainInterfaces'
import { MainProvider, MainContext } from './providers/mainProvider'

import Routes from './routes';
import GlobalStyles from './styles/globalStyles'
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from 'web3'
function getLibrary(provider: any) {
  return new Web3(provider)
}

const Root = () => {

  const { data }: IProviderData | any = useContext(MainContext)

  return (
    <ThemeProvider theme={data?.theme}>
      <GlobalStyles />
      <Routes />
    </ThemeProvider>
  )
}

ReactDOM.render(
  <MainProvider>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Root />
    </Web3ReactProvider>
  </MainProvider>
  ,
  document.getElementById('root')
);
