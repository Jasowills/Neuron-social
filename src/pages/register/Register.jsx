import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get form values
    const fullName = e.target.elements.fullName.value;
    const email = e.target.elements.email.value;
    const userName = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    // Create the request body
    const requestBody = {
      fullName,
      email,
      userName,
      password,
    };

    setLoading(true);

    try {
      const response = await fetch("https://eager-toad-top-hat.cyclic.app/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        // Handle success
        setSuccessMessage("Signup successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000); // Redirect to /login after 2 seconds
      } else {
        // Handle error
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      // Handle network error or other issues
      setError("Error signing up. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Neuron Social.</h1>
          <p>
            "Embark on a journey of intellectual discovery with Neuron! Social 🚀 Sign up today and join a community where knowledge knows no bounds. Connect, share, and explore the world of ideas. Your journey to intellectual enlightenment starts here!"
          </p>
          <span>Do you have an account?</span>
          <Link to="/">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" name="fullName" required placeholder="Full name" />
            <input type="email" name="email" required placeholder="Email" />
            <input type="password" name="password" required placeholder="Password" />
            <input type="text" name="username" required placeholder="Username" />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating your account..." : "Register"}
            </button>
          </form>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;
