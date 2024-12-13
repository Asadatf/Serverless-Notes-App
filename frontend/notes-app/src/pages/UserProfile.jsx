import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../constants";
import Compressor from "compressorjs";
import { FaEnvelope, FaUser, FaLock, FaUnlock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const UserProfile = () => {
  const { user, updateUser } = useAuthContext();
  const navigate = useNavigate();
  const [pic, setPic] = useState({ myFile: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      setUsername(user.username);
      setEmail(user.email);
      setPic({ myFile: user.pic });
      navigate("/profile");
    }
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    // Prepare the payload as JSON
    const updatedUser = {
      pic: pic.myFile, // Base64 string for the picture
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    if (!currentPassword) {
      delete updatedUser.currentPassword;
    }
    if (!newPassword) {
      delete updatedUser.newPassword;
    }

    const response = await fetch(API_ROUTES.USER_PROFILE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updatedUser),
    });

    const json = await response.json();

    if (response.ok) {
      toast.success("Profile updated successfully!");
      setUsername(json.username);
      setEmail(json.email);
      setPic({ myFile: json.pic || "" });
      setCurrentPassword("");
      setNewPassword("");

      updateUser({
        ...user,
        username: json.username,
        email: json.email,
        pic: json.pic,
      });
    } else {
      toast.error(json.message || "Failed to update profile.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    new Compressor(file, {
      quality: 0.6, // Adjust quality from 0 (worst) to 1 (best)
      maxWidth: 800, // Adjust max width
      maxHeight: 800, // Adjust max height
      success(result) {
        convertToBase64(result)
          .then((base64) => {
            console.log(base64); // Base64 string of the compressed image
            setPic({ ...pic, myFile: base64 }); // Update state with the Base64 string
          })
          .catch((err) => {
            console.error("Error converting to Base64", err);
          });
      },
      error(err) {
        console.error("Compression Error:", err);
      },
    });
  };

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h2>Update Profile</h2>
          <div className="input-box">
            <label>Username: </label>
            <input type="text" value={username} disabled />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <label>Email: </label>
            <input type="text" value={email} disabled />
            <FaEnvelope className="icon" />
          </div>
          <div>
            <div>
              <label>Profile Picture: </label>
              <input
                type="file"
                name="myFile"
                id="file-upload"
                accept=".jpeg, .png, .jpg"
                onChange={handleFileChange}
              />
            </div>

            {pic && (
              <div className="pic-container">
                <img
                  src={pic.myFile}
                  alt="Profile Preview"
                  width="100"
                  height="100"
                  style={{ borderRadius: "50%" }}
                />
              </div>
            )}
          </div>

          <div className="input-box">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {passwordVisible ? (
              <FaUnlock className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaLock className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>
          <div className="input-box">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {passwordVisible ? (
              <FaUnlock className="icon" onClick={togglePasswordVisibility} />
            ) : (
              <FaLock className="icon" onClick={togglePasswordVisibility} />
            )}
          </div>

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
