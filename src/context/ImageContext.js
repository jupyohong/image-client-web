import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import axios from "axios";

import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [me] = useContext(AuthContext);

  const pastImageUrl = useRef();

  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState("/images");
  const [publicImages, setPublicImages] = useState([]);
  const [privateImages, setPrivateImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  /**
   * useEffect(()=> {}, [sth])  sth이 바뀔 때마다
   * useEffect(()=> {}, [])     컴포넌트가 마운트되거나 렌더링 되었을 때
   * useEffect(()=> {})         뭐든 바뀔 때마다
   */
  useEffect(() => {
    if (pastImageUrl.current === imageUrl) return;
    setImageLoading(true);
    axios
      .get(imageUrl)
      .then((result) =>
        isPublic
          ? setPublicImages((prevData) => [...prevData, ...result.data])
          : setPrivateImages((prevData) => [...prevData, ...result.data])
      )
      .catch((err) => {
        console.error(err);
        setImageError(err);
        // throw new Error("INTERNAL_SERVER_ERROR");
      })
      .finally(() => {
        setImageLoading(false);
        pastImageUrl.current = imageUrl;
      });
  }, [imageUrl, isPublic]);
  useEffect(() => {
    if (me) {
      setImageLoading(true);
      axios.defaults.headers.common.sessionid = me.sessionId;
      axios
        .get("/users/images")
        .then((result) => {})
        .catch((err) => {
          console.error(err);
          // throw new Error("INTERNAL_SERVER_ERROR");
        })
        .finally(() => setImageLoading(false));
    } else {
      setPrivateImages([]);
      setIsPublic(true);
    }
  }, [me]);

  return (
    // value는 하위 모든 컴포넌트에서 접근 가능
    <ImageContext.Provider
      value={{
        isPublic,
        setIsPublic,
        setImageUrl,
        images: isPublic ? publicImages : privateImages,
        setPublicImages,
        setPrivateImages,
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
