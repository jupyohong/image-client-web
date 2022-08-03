import axios from "axios";
import React, { useEffect, useState } from "react";

const Image = ({ imageKey }) => {
  const [isError, setIsError] = useState(false);
  const [signedUrl, setSignedUrl] = useState(imageKey);

  useEffect(() => {
    let intervalId;
    if (isError && !intervalId) {
      intervalId = setInterval(() => {
        axios.get(`/images/presigned/${imageKey}`).then((result) => {
          setSignedUrl(result.data.url);
        });
      }, 1000);
    } else if (!isError && intervalId) clearInterval(intervalId);
    else setSignedUrl(imageKey);
    return () => clearInterval(intervalId);
  }, [isError, setSignedUrl, imageKey]);

  return (
    <img
      alt=""
      onError={() => setIsError(true)}
      onLoad={() => {
        setIsError(false);
      }}
      style={{ display: isError ? "none" : "block" }}
      src={signedUrl}
    />
  );
};

export default Image;
