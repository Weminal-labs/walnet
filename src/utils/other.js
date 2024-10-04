export const OtherUtils = {
  async copy(content, fn, value) {
    await navigator.clipboard.writeText(content);
    setTimeout(() => fn(value), 0);
  },

  clampNumber(num, min = 0, max = 1000) {
    if (num < min) {
      return `<${min.toString()}`;
    }

    if (num > max) {
      return `>${max.toString()}`;
    }

    return num.toString();
  },
};
