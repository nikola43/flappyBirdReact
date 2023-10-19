export const SupportedChainId = {
  POLYGON_MAINNET: 137,
  POLYGON_TESTNET: 80001,
  POLYGON_HEX_MAINNET: "0x89",
  POLYGON_HEX_TESTNET: "0x13881",
};

export const PacmanAddressess = {
  [SupportedChainId.POLYGON_MAINNET]: "",
  [SupportedChainId.POLYGON_TESTNET]: "0x03be71Ec45e755174abD71502B60B4F2aF815675",
  [SupportedChainId.POLYGON_HEX_MAINNET]: "",
  [SupportedChainId.POLYGON_HEX_TESTNET]: "0x03be71Ec45e755174abD71502B60B4F2aF815675",
};

export default module.exports = {
  SupportedChainId: SupportedChainId,
  PacmanAddressess: PacmanAddressess,
};