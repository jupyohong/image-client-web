import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";

const ImagePage = () => {
  const { imageId } = useParams();
  const { images, setPublicImages, setPrivateImages } =
    useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [image, setImage] = useState();
  const history = useHistory();

  // images 배열이 바뀔 때마다 실행
  useEffect(() => {
    const img = images.find((image) => image.key === imageId);
    if (img) setImage(img);
  }, [images, imageId]);

  // 첫 로딩(새로고침) 또는 다른 이미지로 바뀔 때만 실행
  useEffect(() => {
    if (image && image.key === imageId) return;
    axios
      .get(`images/presigned/${imageId}`)
      .then((data) => setImage(data))
      .catch((err) => toast.error(err.response.data.message));
  }, [image, imageId]);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setLiked(true);
  }, [me, image]);

  if (!image) return <h3>Loading image...</h3>;

  const updateImages = (images, image) =>
    [...images.filter((image) => image.key !== imageId), image].sort((a, b) => {
      if (a.key < b.key) return 1;
      else return -1;
    });

  const likeImageHandler = async () => {
    await axios
      .patch(`/images/${imageId}/${liked ? "unlike" : "like"}`)
      .then((data) => {
        if (data.public)
          setPublicImages((prevData) => updateImages(prevData, data));
        setPrivateImages((prevData) => updateImages(prevData, data));
        setLiked(!liked);
      })
      .catch((err) => {
        toast.warn("Need to login first ;)");
        history.push("/auth/signin");
      });
  };

  const deleteImageHandler = async () => {
    try {
      if (!window.confirm("Do you want to delete the image permanently?"))
        return;
      const result = await axios.delete(`/images/${imageId}`);
      toast.success(result.data.message);
      setPublicImages((prevData) =>
        prevData.filter((image) => image.key !== imageId)
      );
      setPrivateImages((prevData) =>
        prevData.filter((image) => image.key !== imageId)
      );
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h3>Image Page</h3>
      <img style={{ width: "100%" }} alt={imageId} src={image.url} />
      <span>Likes {image.likes.length}</span>
      {me && me.userId === image.user._id && (
        <button
          style={{ float: "right", marginLeft: 10 }}
          onClick={deleteImageHandler}
        >
          Delete
        </button>
      )}
      <button style={{ float: "right" }} onClick={likeImageHandler}>
        {liked ? "Unlike" : "Like"}
      </button>
    </div>
  );
};

export default ImagePage;
