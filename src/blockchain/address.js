export const SupportedChainId = {
  POLYGON_MAINNET: 137,
  POLYGON_TESTNET: 1,
  POLYGON_HEX_MAINNET: "0x89",
  POLYGON_HEX_TESTNET: "13881",
};

export const PacmanAddressess = {
  [SupportedChainId.POLYGON_MAINNET]: "",
  [SupportedChainId.POLYGON_TESTNET]: "0x22385C2b0Ce23b30a0795B1C6973d80E8419E4Af",
  [SupportedChainId.POLYGON_HEX_MAINNET]: "",
  [SupportedChainId.POLYGON_HEX_TESTNET]: "0x22385C2b0Ce23b30a0795B1C6973d80E8419E4Af",
};

export default module.exports = {
  SupportedChainId: SupportedChainId,
  PacmanAddressess: PacmanAddressess,
};