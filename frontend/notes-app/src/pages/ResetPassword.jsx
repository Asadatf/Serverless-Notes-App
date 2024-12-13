import { useFormik } from "formik";
import { FaLock, FaUnlock } from "react-icons/fa";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom"; // Ensure toastify is imported
import { useState } from "react";
import { Buffer } from "buffer";
import { API_ROUTES } from "../constants";

const decodeBase64 = (encodedString) => {
  const buff = Buffer.from(encodedString, "base64");
  return buff.toString("utf-8");
};

const ResetPassword = () => {
  const { token } = useParams();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const decodedToken = decodeBase64(token);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&]/,
          "Password must contain at least one special character (@$!%*?&)"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      const { newPassword } = values;

      try {
        const response = await fetch(
          `${API_ROUTES.RESET_PASSWORD}/${decodedToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: newPassword }),
          }
        );

        if (!response.ok) {
          throw new Error("Link expired or invalid");
        }

        const data = await response.json();

        toast.success(data.message);

        // Redirect after success
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } catch (error) {
        toast.error("Your link has expired or there was an error");
      }
    },
  });

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="form-box reset-password">
        <form onSubmit={formik.handleSubmit}>
          <h1>
            <b>Reset Password</b>
          </h1>
          <div className="input-box">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter New Password"
              name="newPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              required
            />
            {passwordVisible ? (
              <FaUnlock className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaLock className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="error">{formik.errors.newPassword}</div>
          ) : null}
          <div className="input-box">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Confirm New Password"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              required
            />
            {passwordVisible ? (
              <FaUnlock className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaLock className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error">{formik.errors.confirmPassword}</div>
          ) : null}
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
