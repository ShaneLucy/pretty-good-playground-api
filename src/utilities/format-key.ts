const formatKey = (key: string): string => {
  const keySplitOnNewLineLength = key.split("\\n").length - 1;

  return key
    .split("\\n")
    .map((string, index) => (index <= keySplitOnNewLineLength ? `${string}\n` : `${string}`))
    .reduce((previousValue, currentValue) => previousValue.concat(currentValue), ``);
};

export default formatKey;
