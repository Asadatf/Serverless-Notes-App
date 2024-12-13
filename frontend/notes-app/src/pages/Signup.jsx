import { FaUser, FaLock, FaUnlock, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Link } from "react-router-dom";

export default function LoginRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(username, email, password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="wrapper">
      <div className="form-box register">
        <form onSubmit={handleSubmit}>
          <h1>
            <b>Signup</b>
          </h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter Username"
              name="uname"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              name="uname"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              name="psw"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {passwordVisible ? (
              <FaUnlock className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaLock className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" name="remember" id="remember" />I agree to
              the terms & conditions
            </label>
          </div>
          <button type="submit" disabled={isLoading}>
            Signup
          </button>
          <div className="register-link">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
