import { convertSvgToPng } from "./convert";

export const copy = async ({
  value,
  asImage = false,
}: {
  value: string;
  asImage?: boolean;
}) => {
  if (asImage) {
    return copyImage({ url: value });
  }
  return copyText({ value });
};

export const copyText = async ({ value }: { value: string }) => {
  await navigator.clipboard.writeText(value);
  return value;
};

export const copyImage = async ({ url }: { url: string }) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();

  const { data: pngBlob } = blob.type.startsWith("image/svg")
    ? await convertSvgToPng({ value: blob })
    : { data: blob };

  const data = [new ClipboardItem({ [pngBlob.type]: pngBlob })];
  await navigator.clipboard.write(data);

  return pngBlob;
};
