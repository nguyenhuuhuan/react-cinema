import * as React from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Props {
  image: File,
  setCropImage: React.Dispatch<React.SetStateAction<string>>,
}

export default function CropImage(props: Props) {
  const [upImg, setUpImg] = React.useState<any>();
  const imgRef = React.useRef(null);
  const previewCanvasRef = React.useRef(null);
  const [crop, setCrop] = React.useState<Crop>({
    unit: '%', width: 30, x: 25,
    y: 25, height: 50
  });
  const [completedCrop, setCompletedCrop] = React.useState<any>(null);

  React.useEffect(() => {
    onSelectFile(props.image);
  }, []);

  const onSelectFile = (file: Blob) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => setUpImg(reader.result));
    reader.readAsDataURL(file);
  };

  const onLoad = React.useCallback((img: any) => {
    imgRef.current = img;
  }, []);

  React.useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image: HTMLImageElement = imgRef.current;
    const canvas: HTMLCanvasElement = previewCanvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return
    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    const imagee = new Image();
    imagee.src = canvas.toDataURL();
    props.setCropImage(imagee.src);
  }, [completedCrop]);

  return (
    <div className='Crop-Image'>
      <ReactCrop

        // onImageLoaded={onLoad}
        aspect={16 / 9}
        crop={crop}
        onChange={(c: PixelCrop) => setCrop(c)}
        onComplete={(c: PixelCrop) => setCompletedCrop(c)}
      />
      <img src={upImg} />
      <div style={{ display: 'none' }}>
        <canvas
          ref={previewCanvasRef}
          style={{
            width: Math.round(completedCrop && completedCrop.width ? completedCrop.width : 0),
            height: Math.round(completedCrop && completedCrop.height ? completedCrop.height : 0)
          }}
        />
      </div>
    </div>
  );
}
