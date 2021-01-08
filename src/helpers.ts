
export const stringToCode = ({
  value,
  joiner = '-',
}: {
  value: string,
  joiner?: string,
}) => {
  const result = [];
  let p = 0;

  for (let thisIndex = 0; thisIndex < value.length; thisIndex++) {
    const char = value.charCodeAt(thisIndex);

    if (p) {
      result.push((0x10000 + ((p - 0xD800) << 10) + (char - 0xDC00)).toString(16));
      p = 0;
    } else if (0xD800 <= char && char <= 0xDBFF) {
      p = char;
    } else {
      result.push(char.toString(16));
    }
  }

  return result.join(joiner);
};

export const clipboardWrite = ({
  value,
}: {
  value: string;
}) => {
  const copyFrom = document.createElement('textarea');
  copyFrom.textContent = value;

  document.body.appendChild(copyFrom);
  copyFrom.select();

  document.execCommand('copy');

  copyFrom.blur();
  document.body.removeChild(copyFrom);
};
