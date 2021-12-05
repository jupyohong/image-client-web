import React, { useContext, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";
import "./ImageList.css";
import Image from "./Image";

const ImageList = () => {
  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  const {
    setImageUrl,
    isPublic,
    setIsPublic,
    images,
    imageLoading,
    imageError,
  } = useContext(ImageContext);

  const loadImages = useCallback(() => {
    if (imageLoading) return;
    // Last image ID for infinite scroll
    const lastId = images[images.length - 1]._id;
    setImageUrl(`${isPublic ? "" : "/users"}/images?lastId=${lastId}`);
  }, [images, imageLoading, isPublic, setImageUrl]);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loadImages]);

  const imgList = images.map((image, idx) => (
    <Link
      key={image.key}
      to={`/images/${image._id}`}
      ref={idx + 6 === images.length ? elementRef : undefined}
    >
      <Image
        imageUrl={`https://image-upload-test-coconutsilo.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
      />
      {/* <img
        key={image._id}
        src={}
        alt={image.originalFileName}
      /> */}
    </Link>
  ));

  return (
    <>
      <div>
        <h3 style={{ display: "inline-block", marginRight: 10 }}>Image list</h3>
        {!!me && (
          <button
            onClick={() => {
              setIsPublic(!isPublic);
            }}
          >
            {"Shows " + (isPublic ? "private" : "public") + " images"}
          </button>
        )}
        <div className="image-list-container">{imgList}</div>
      </div>
      {imageError && <div>Error occured while loading images</div>}
      {imageLoading && <div>Loading images...</div>}
    </>
  );
};

export default ImageList;
