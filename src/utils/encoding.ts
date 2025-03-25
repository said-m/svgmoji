export const stringToCode = ({
  value,
  joiner = "-",
}: {
  value: string;
  joiner?: string;
}) => {
  const result = [];
  let p = 0;

  for (let thisIndex = 0; thisIndex < value.length; thisIndex++) {
    const char = value.charCodeAt(thisIndex);

    if (p) {
      result.push(
        (0x10000 + ((p - 0xd800) << 10) + (char - 0xdc00)).toString(16)
      );
      p = 0;
    } else if (0xd800 <= char && char <= 0xdbff) {
      p = char;
    } else {
      result.push(char.toString(16));
    }
  }

  return result.join(joiner);
};
