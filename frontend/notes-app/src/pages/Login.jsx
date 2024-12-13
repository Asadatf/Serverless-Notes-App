import { FaUser, FaLock, FaUnlock } from "react-icons/fa";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";

export default function LoginRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(username, password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>
            <b>Login</b>
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
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              name="psw"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {passwordVisible ? (
              <FaUnlock
                className="icon"
                onClick={togglePasswordVisibility}
                aria-label="unlock icon"
              />
            ) : (
              <FaLock
                className="icon"
                onClick={togglePasswordVisibility}
                aria-label="lock icon"
              />
            )}
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" name="remember" id="remember" />
              Remember Me
            </label>
            <p>
              <Link to="/forgetPassword">Forgot Password?</Link>
            </p>
          </div>
          <button type="submit" disabled={isLoading}>
            Log in
          </button>
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </div>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
