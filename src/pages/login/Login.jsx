import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);

    // Replace these placeholders with the actual email and password input values.
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    const requestBody = {
      email,
      password,
    };

    try {
      const response = await fetch("https://eager-toad-top-hat.cyclic.app/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Save the response data in localStorage
        localStorage.setItem("userData", JSON.stringify(responseData));

        // Redirect to the home page after successful login
        navigate("/home");
      } else {
        // Handle login failure
        setError("Invalid email or password.");
      }
    } catch (error) {
      // Handle network error or other issues
      setError("Error logging in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Welcome back.</h1>
          <p>
            "Step into a World of Infinite Knowledge 🚀 - Where Minds Connect, Ideas Flourish, and Boundaries Fade. Welcome Back to NeuronSocial, Where Every Login is a Journey to Intellectual Enlightenment!"
          </p>
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Logging in..." : "LOG IN"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
