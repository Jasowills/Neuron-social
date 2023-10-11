import React, { useState, useEffect } from "react";
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [liked, setLiked] = useState(false); // State to track whether the post is liked or not
  const {
    user,
    _id,
    content,
    userId,
    image,
    likes,
    comments,
    createdAt,
  } = post;

  // Function to format createdAt timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 86400) {
      const diffInHours = Math.floor(diffInSeconds / 3600);
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return postDate.toLocaleDateString(undefined, options);
    }
  };

  const formattedCreatedAt = formatTimestamp(createdAt);

  // Function to handle liking a post
  const handleLike = async () => {
    try {
      const response = await fetch("https://eager-toad-top-hat.cyclic.app/api/v1/post/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: _id, // Pass the post ID to the request
          userId: userId, // Pass the user ID to the request
        }),
      });

      if (response.ok) {
        // If the like request is successful, update the liked state
        setLiked(true);
      } else {
        console.error("Failed to like the post");
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  useEffect(() => {
    // Check if the current user has already liked the post and update the liked state accordingly
    if (likes.includes(user.id)) {
      setLiked(true);
    }
  }, [likes, user.id]);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{user.username}</span>
              </Link>
              <span className="date">{formattedCreatedAt}</span>
            </div>
          </div>
          {/* <div className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
            <MoreHorizIcon onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
            {isDropdownOpen && (
              <ul tabIndex={0} className="dropdown-content">
                <li>
                  <a>Edit</a>
                </li>
                <li>
                  <a>Delete</a>
                </li>
              </ul>
            )}
          </div> */}
        </div>
        <div className="content">
          <p>{content}</p>
          <img src={image} alt="" />
        </div>
        <div className="info">
          <div className="item" onClick={handleLike}>
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {likes.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments />}
      </div>
    </div>
  );
};

export default Post;
