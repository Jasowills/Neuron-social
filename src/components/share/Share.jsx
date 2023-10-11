import React, { useState } from "react";
import "./share.scss";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import img from "../../assets/img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Share = () => {
  const authData = JSON.parse(localStorage.getItem("userData")) || {};
  const { user } = authData;
  const { userName, profilePicture } = user || {};

  const [content, setContent] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false); // State for posting status

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedImageData = canvas.toDataURL("image/jpeg", 0.8);
          setImageBase64(compressedImageData);
          setImagePreview(compressedImageData);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    setIsPosting(true); // Set posting status to true during the request

    try {
      const response = await fetch(
        "https://eager-toad-top-hat.cyclic.app/api/v1/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            content,
            image: imageBase64,
          }),
        }
      );

      if (response.ok) {
        console.log("Post created successfully");
        setContent("");
        setImageBase64("");
        setImagePreview(null);
        window.location.reload(); // Refresh the browser
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false); // Reset posting status after the request
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={profilePicture} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind ${userName}?`}
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <hr />
        <div className="bottom">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "100%" }}
            />
          )}
          <div className="divider">
            <div className="left">
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="file">
                <div className="item">
                  <img src={img} alt="" />
                  <span>Add Image</span>
                </div>
              </label>
              <div className="item">
                <img src={Map} alt="" />
                <span>Add Place</span>
              </div>
              <div className="item">
                <img src={Friend} alt="" />
                <span>Tag Friends</span>
              </div>
            </div>
            <div className="right">
              <button onClick={handleShare}>
                {isPosting ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="spinner-icon"
                    spin
                  />
                ) : (
                  "Share"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
