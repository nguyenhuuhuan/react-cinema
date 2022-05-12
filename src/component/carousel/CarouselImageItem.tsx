import * as React from 'react';

export default function CarouselImageItem({ url }: { url: string }) {
    return (
        <div className="data-item-gallery">
        <img className='image-carousel iframe-youtube' src={url} alt={url} draggable={false} />
        </div>
    );
}
