const ChainParams = [
  // arbitrum testnet
  {
    chainId: 1,
    chainName: "Polygon Mumbai Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-mumbai.infura.io/v3/fe0b9cf93b1047bda0a6e7915f041380"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
  // arbitrum mainnet
  {
    chainId: 42161,
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  {
    chainId: 1,
    chainName: "eth mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://eth.llamarpc.com"],
    blockExplorerUrls: ["https://etherscan.io/"],
  }
];

export default ChainParams;
