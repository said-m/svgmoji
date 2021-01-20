
export const copy = ({
  value,
}: {
  value: string;
}) => {
  const textareaEl = document.createElement('textarea');
  textareaEl.textContent = value;

  document.body.appendChild(textareaEl);
  textareaEl.select();

  document.execCommand('copy');

  textareaEl.blur();
  document.body.removeChild(textareaEl);
};
