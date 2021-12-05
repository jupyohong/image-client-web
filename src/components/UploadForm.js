import React, { useState, useContext, useRef } from "react";

import axios from "axios";
import { toast } from "react-toastify";

import { ImageContext } from "../context/ImageContext";

import "./UploadForm.css";
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
  const { setPublicImages, setPrivateImages } = useContext(ImageContext);
  const inputRef = useRef();

  const [files, setFiles] = useState(null);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isPublic, setIsPublic] = useState(true); // public은 reserved word
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const imageSelectHandler = async (event) => {
    const imgFiles = event.target.files;
    if (!imgFiles) return;
    setFiles(imgFiles);
    // Image preview
    const imagePreviews = await Promise.all(
      [...imgFiles].map(async (imgFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imgFile);
            fileReader.onload = (e) =>
              resolve({ imgSrc: e.target.result, fileName: imgFile.name });
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
  };

  const imageUploadHandlerV2 = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Get presignedUrl for images from Express API server
      const presignedData = await axios.post("/images/presigned", {
        contentTypes: [...files].map((file) => file.type),
      });

      const s3postResult = await Promise.all(
        [...files].map((file, index) => {
          const { presigned } = presignedData.data[index];
          const formData = new FormData();
          for (const [key, value] of Object.entries(presigned.fields)) {
            formData.append(key, value);
          }
          // for (const key in presigned.fields) {
          //   console.log({ key, value: presigned.fields[key] });
          //   formData.append(key, presigned.fields[key]);
          // }
          // File must be added at last
          formData.append("Content-Type", file.type);
          formData.append("file", file);
          return axios.post(presigned.url, formData, {
            onUploadProgress: (e) => {
              setUploadProgress((prevData) => {
                const newData = [...prevData];
                newData[index] = Math.round((e.loaded / e.total) * 100);
                return newData;
              });
            },
          });
        })
      );

      console.log({ s3postResult });
      console.log({ presignedData });

      const result = await axios.post("/images", {
        images: [...files].map((file, index) => {
          return {
            imageKey: presignedData.data[index].imageKey,
            originalFileName: file.name,
          };
        }),
        public: isPublic,
      });

      if (isPublic)
        setPublicImages((prevData) => [...result.data, ...prevData]);
      setPrivateImages((prevData) => [...result.data, ...prevData]);

      toast.success("Files uploaded :)");
      setTimeout(() => {
        setUploadProgress([]);
        setFiles(null);
        setPreviews([]);
        inputRef.current = null;
        setIsLoading(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setUploadProgress([]);
      setFiles(null);
      setPreviews([]);
      toast.error(err.response?.data.message);
      setIsLoading(false);
    }
  };

  // const imageUploadHandler = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   for (const file of files) formData.append("images", file);
  //   formData.append("public", isPublic);
  //   try {
  //     const result = await axios.post("/images", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       onUploadProgress: (e) => {
  //         setUploadProgress(Math.round((e.loaded / e.total) * 100));
  //       },
  //     });
  //     if (isPublic)
  //       setPublicImages((prevData) => [...result.data, ...prevData]);
  //     setPrivateImages((prevData) => [...result.data, ...prevData]);
  //     toast.success("Files uploaded :)");
  //     setTimeout(() => {
  //       setUploadProgress([]);
  //       setFiles(null);
  //       setPreviews([]);
  //       inputRef.current = null;
  //     }, 5000);
  //   } catch (error) {
  //     setUploadProgress([]);
  //     setFiles(null);
  //     setPreviews([]);
  //     toast.error(error.response.data.message);
  //   }
  // };

  const previewImages = previews.map((preview, index) => (
    <div key={index}>
      <img
        src={preview.imgSrc}
        alt={preview.name}
        className={`preview-img ${preview.imgSrc && "preview-img-show"}`}
      />
      <ProgressBar progress={uploadProgress[index]} />
    </div>
  ));

  const uploadedImagesName =
    previews.length === 0
      ? "No file uploaded"
      : previews
          .reduce((acc, cur) => {
            acc.push(cur.fileName);
            return acc;
          }, [])
          .join(", ");

  return (
    <form onSubmit={imageUploadHandlerV2}>
      {previewImages}
      <div className="file-dropper">
        {/* <label htmlFor="images">{files[0]?.name || DEFAULT_TEXT} </label> */}
        <label htmlFor="images">{uploadedImagesName}</label>
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>
      <input
        ref={(ref) => (inputRef.current = ref)}
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">Private</label>
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          height: 40,
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default UploadForm;
