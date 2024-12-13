import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope } from "react-icons/fa";
import { API_ROUTES } from "../constants.js"; // Replace with actual routes
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch(API_ROUTES.FORGET_PASSWORD, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          toast.success("Email sent successfully");
        } else if (response.status === 404) {
          toast.error("Email not found");
        } else {
          toast.error("Server error");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="form-box forget-password">
        <form onSubmit={formik.handleSubmit}>
          <h1>
            <b>Forgot Password</b>
          </h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              required
            />
            <FaEnvelope className="icon" />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
          <button type="submit" disabled={isLoading}>
            Send Reset Link
          </button>
          <div className="login-link">
            <p>
              Remember your password? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
