// In some case the leading char is 0 after the 0x and it got truncated
// This function will add it back if needed cause indexer doesn't auto pad it
export function padAddressIfNeeded(address) {
  if (address.length === 66) {
    return address;
  }
  const paddingNeeded = 66 - address.length;
  const padding = "0".repeat(paddingNeeded);
  return `0x${padding}${address.slice(2)}`;
}
