export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw image
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  ctx.drawImage(image, 0, 0);

  // Extract the cropped image data
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // Set canvas width to final desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste generated crop image in canvas
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(new File([file], 'cropped_image.jpg', { type: 'image/jpeg' }));
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg');
  });
}
