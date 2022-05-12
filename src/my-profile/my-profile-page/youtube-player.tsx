interface Props {
  src: string;
}

export function VideoPlayer({ src }: Props) {
  return (
    <div className="data-item-youtube">
      <iframe src={src} frameBorder="0" className="iframe-youtube"></iframe>;
    </div>
  );
}
