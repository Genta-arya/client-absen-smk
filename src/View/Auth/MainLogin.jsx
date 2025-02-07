import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Text } from "../../constants/Constants";
import ActModal from "../../components/Modal/ActModal";
import { HandleLogin } from "../../Api/Services/LoginServices";
import { handleError } from "../../Utils/Error";
import LoadingButton from "../../components/LoadingButton";
import { ResponseHandler } from "../../Utils/ResponseHandler";
import useAuthStore from "../../Lib/Zustand/AuthStore";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

const MainLogin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, user } = useAuthStore();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [capslock, setCapslock] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleKeyUp = (event) => {
    if (event.getModifierState("CapsLock")) {
      setCapslock(true);
    } else {
      setCapslock(false);
    }
  };

  useEffect(() => {
    setPassword(localStorage.getItem("savedPassword"));
    setNim(localStorage.getItem("savedNim"));
    setRememberMe(localStorage.getItem("rememberMe") === "true");
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyUp);

    if (capslock) {
      toast.info("CapsLock aktif");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyUp);
    };
  }, [capslock]);

  // useEffect(() => {
  //   const token = user?.token;

  //   if (token) {
  //     if (user?.role === "user") {
  //       navigate("/app");
  //     } else {
  //       navigate("/admin");
  //     }
  //   }
  // }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    // if (!recaptchaToken) {
    //   alert("Please complete the CAPTCHA");
    //   setLoading(false);
    //   return;
    // }

    setLoading(true);
    try {
      const response = await HandleLogin({ nim, password });

      if (rememberMe) {
     
        localStorage.setItem("savedNim", nim);
        localStorage.setItem("rememberMe", rememberMe);
        localStorage.setItem("savedPassword", password);
      } else {
      
        localStorage.removeItem("savedNim");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedPassword");
      }

      setUser(response.data);
      if (response.data.role === "user") {
        navigate("/app");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Tidak dapat terhubung ke server.");
      }
      ResponseHandler(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue dark:bg-dark-bg">
      <Helmet>
        <title>Login - SIPKL</title>
      </Helmet>
      <div className="bg-white p-8  rounded-lg shadow-lg w-[90%] lg:w-[30%] border-t-4 border-orange-500">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScfqgzc3z4pYYehdJbSmuMT8Gp7abIEiE-zw&s"
            alt="Logo"
            className="w-28 h-28 rounded-full"
          />
          <h2 className="text-2xl mt-2 font-semibold text-center text-gray-800 ">
            SIPKL
          </h2>
          <p>
            <span className="text-gray-600">v1.0.0</span>
          </p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4 relative">
            <label
              htmlFor="nim"
              className="block text-gray-700 font-medium text-sm lg:text-base md:text-base"
            >
              NISN / NIP
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaUser className="ml-3 text-gray-400" size={20} />
              <input
                type="text"
                id="nim"
                name="nim"
                required
                maxLength={20}
                value={nim}
                onChange={(e) => {
                  const value = e.target.value;
                  // Hanya perbolehkan angka
                  if (/^\d*$/.test(value)) {
                    setNim(value);
                  }
                }}
                className={`w-full text-gray-500 p-2 pl-5  border-none rounded-lg focus:outline-none ${Text}`}
                placeholder="Enter your  NISN / NIP"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium text-sm lg:text-base md:text-base"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaLock className="ml-3 text-gray-400" size={20} />
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 pl-5 text-gray-500 border-none rounded-lg focus:outline-none ${Text} `}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 text-gray-400"
              >
                {passwordVisible ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* reCAPTCHA v2 widget */}
          {/* <div className="mb-6 text-xs flex justify-center">
            <ReCAPTCHA
              type="image"
              size="normal"
              sitekey="6Lcv3L4qAAAAAJoWWTTOuo9SubeanyIoNZ2wPKj5"
              onChange={handleRecaptchaChange}
            />
          </div> */}

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-700 text-sm">
              Ingat Saya
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            title="Login"
            disabled={loading}
            className="w-full py-2 border-b-2 border-oren text-sm bg-blue-600 text-white bg-blue font-semibold rounded-lg hover:bg-blue-700 focus:outline-none "
          >
            <LoadingButton text="Login" loading={loading} />
          </button>

          <div>
            <p
              onClick={() => setModal(true)}
              className="text-sm text-gray-600 mt-2 text-center hover:underline cursor-pointer"
            >
              Lupa Password
            </p>
          </div>
        </form>
      </div>
      {modal && (
        <ActModal
          isModalOpen={modal}
          setIsModalOpen={setModal}
          title={"Lupa Password"}
        >
          <div>
            <p className="text-sm text-gray-600 mt-2 ">
              Hubungi Administrator untuk mereset password Anda
            </p>
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                onClick={() =>
                  window.open("https://wa.me/6289618601348", "_blank")
                }
              >
                <FaWhatsapp size={20} />
                <p className="font-bold text-sm">WhatsApp</p>
              </button>
            </div>
          </div>
        </ActModal>
      )}
    </div>
  );
};

export default MainLogin;
