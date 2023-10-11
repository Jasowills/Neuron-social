import React, { useState, useEffect } from "react";
import Post from "../post/Post";
import "./posts.scss";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch("https://eager-toad-top-hat.cyclic.app/api/v1/posts")
      .then((response) => response.json())
      .then((data) => {
        // Assuming the response structure is { message, success, posts }
        // Ensure that the "posts" property is an array
        if (data) {
          console.log(data)
          setPosts(data.posts); // Update the state with the fetched data
        } else {
          console.error("Invalid response data:", data);
        }
        setIsLoading(false); // Set isLoading to false after fetching
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set isLoading to false in case of an error
      });
  }, []);

  return (
    <div className="posts">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        posts.map((post) => <Post post={post} key={post._id} />)
      )}
    </div>
  );
};

export default Posts;
