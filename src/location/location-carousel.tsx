import React, { useEffect, useState } from "react";
import { User } from "../admin/service";
import { FileUploads } from "../admin/users_carousel/model";
import Carousel from "../component/carousel/Carousel";
import CarouselImageItem from "../component/carousel/CarouselImageItem";
import CarouselVideoItem from "../component/carousel/CarouselVideoItem";
import imgDefault from "../assets/images/video-youtube.png";
import { getLocations } from "./service/index";

import "./style.css";
import { Location } from "./service/location/location";
import { OnClick } from "react-hook-core";

interface Props {
  edit: (e: any, id: string) => void;
  location: Location;
}
export default function LocationCarousel({ edit, location }: Props) {
  const [carousel, setCarousel] = useState(false);
  const [files, setFiles] = useState<FileUploads[]>();
  useEffect(() => {
    handleFetch();
  }, [location, carousel]);
  const locationService = getLocations();
  const handleFetch = async () => {
    if (!carousel || files) return;
    let res
    try {
      res = await locationService.fetchImageUploaded(location.id);
    } catch (error) {

    }
    if (res && res.length > 0) {
      for (const item of res) {
        if (item.type === "youtube") {
          const thumbnails = await locationService.fetchThumbnailVideo(
            item.url
          );
          item.thumbnail = thumbnails.thumbnail;
          item.standardThumbnail = thumbnails.standardThumbnail;
          item.mediumThumbnail = thumbnails.mediumThumbnail;
          item.maxresThumbnail = thumbnails.maxresThumbnail;
          item.hightThumbnail = thumbnails.hightThumbnail;
        }
      }
      setFiles(res);
    } else {
      const info: FileUploads[] = [
        {
          source: "",
          type: "image",
          url: location.imageURL || "",
        },
      ];
      setFiles(info);
    }
  };

  const toggleCarousel = (e: OnClick, enable: boolean) => {
    e.preventDefault();
    setCarousel(enable);
  };
  return (
    <>
      {carousel ? (
        <div className="col s12 m6 l4 xl3 ">
          <div
            className="user-carousel-container "
            onClick={(e) => toggleCarousel(e, false)}
          >
            {files && files.length > 0 ? (
              <Carousel infiniteLoop={true}>
                {files.map((itemData, index) => {
                  switch (itemData.type) {
                    case "video":
                      return (
                        <CarouselVideoItem
                          key={index}
                          type={itemData.type}
                          srcVideo={itemData.url}
                          srcPoster={imgDefault}
                          namePorster={imgDefault}
                        />
                      );
                    case "image":
                      return (
                        // <img className='image-carousel' src={itemData.url} key={index} alt={itemData.url} draggable={false}/>
                        <CarouselImageItem key={index} url={itemData.url} />
                      );
                    case "youtube":
                      const thumbnail =
                        itemData.standardThumbnail ||
                        itemData.mediumThumbnail ||
                        itemData.thumbnail ||
                        itemData.maxresThumbnail ||
                        itemData.hightThumbnail;
                      return (
                        <CarouselVideoItem
                          key={index}
                          type={itemData.type}
                          srcVideo={itemData.url}
                          srcPoster={thumbnail || ""}
                          namePorster={thumbnail || ""}
                        />
                      );
                    default:
                      break;
                  }
                })}
              </Carousel>
            ) : (
              ""
            )}
            <div className="user-carousel-content">
              <h3
                onClick={(e) => edit(e, location.id)}
                className={location.status === "I" ? "inactive" : ""}
              >
                {location.name}
              </h3>
              <p>{location.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <li
          className="col s12 m6 l4 xl3 card "
          onClick={(e) => toggleCarousel(e, true)}
        >
          <section>
            <div
              className="cover"
              style={{
                backgroundImage: `url('${location.imageURL}')`,
              }}
            ></div>
            <h3>{location.name}</h3>
          </section>
        </li>
      )}
    </>
  );
}
