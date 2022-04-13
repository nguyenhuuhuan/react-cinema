import * as React from 'react';

export default function CarouselImageItem({ url }: { url: string }) {
    return (
        <img className='image-carousel' src={url} alt={url} draggable={false} />
    );
}
