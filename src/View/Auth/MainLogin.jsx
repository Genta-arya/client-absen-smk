import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Text } from "../../constants/Constants";
import ActModal from "../../components/Modal/ActModal";

const MainLogin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-dark-bg">
      <Helmet>
        <title>Login - Blog</title>
      </Helmet>
      <div className="bg-white p-8  rounded-lg shadow-lg w-[90%] lg:w-[30%]">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScfqgzc3z4pYYehdJbSmuMT8Gp7abIEiE-zw&s"
            alt="Logo"
            className="w-28 h-28 rounded-full"
          />
          <h2 className="text-2xl mt-2 font-semibold text-center text-gray-800 ">
            LAMPIAS
          </h2>
          <p>
            <span className="text-gray-600">v1.0.0</span>
          </p>
        </div>
        <form onSubmit={handleLogin}>
          {/* Username input */}
          <div className="mb-4 relative">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium text-sm lg:text-base md:text-base"
            >
              NISN / NIP
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaUser className="ml-3 text-gray-400" size={20} />
              <input
                type="text"
                id="username"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

          {/* Submit Button */}
          <button
            type="submit"
            title="Login"
            className="w-full py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none "
          >
            Login
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
            <p>Hubungi Administrator untuk mereset password Anda</p>
            <div className="flex justify-end">

            <button
              className="flex items-center gap-2 mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
              onClick={() =>
                window.open("https://wa.me/6289618601348", "_blank")
              }
            >
              {/* WhatsApp Icon */}
              <FaWhatsapp size={20} />
              <p className="font-bold text-sm">WhatsApp Administrator</p>
            </button>
            </div>
          </div>
        </ActModal>
      )}
    </div>
  );
};

export default MainLogin;
