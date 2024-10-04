export const AccountUtils = {
  padAddressIfNeeded(address) {
    if (address.length === 66) {
      return address;
    }
    const paddingNeeded = 66 - address.length;
    const padding = "0".repeat(paddingNeeded);
    return `0x${padding}${address.slice(2)}`;
  },

  hideAddress(address) {
    if (!address) return;
    const first4Digits = address.slice(0, 4);
    const last4Digits = address.slice(-4);
    return first4Digits + " .. " + last4Digits;
  },
};
