import React from "react";

export function useCopy() {
  const [copied, setCopied] = React.useState(false);

  const copy = async function (address) {
    if (copied) return;
    setCopied(true);
    await navigator.clipboard.writeText(address);
    setTimeout(() => setCopied(false), 2000);
  };

  return { copied, copy };
}
