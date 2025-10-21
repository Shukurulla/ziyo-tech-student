import React, { useState, useEffect } from "react";
import { Logo } from "../assets";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Register = () => {
  const { isLoading } = useSelector((state) => state.user);
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    login: "",
    password: "",
    level: "",
    school: "",
    workplace: "",
    rank: "",
  });
  const [currentStep, setCurrentStep] = useState("form"); // 'role' or 'form'
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registerHandler = () => {
    const userData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      login: formData.login,
      password: formData.password,
      type: userType,
    };

    if (userType === "student") {
      userData.level = formData.level;
      userData.school = formData.school;
    } else {
      userData.workplace = formData.workplace;
      userData.rank = formData.rank;
    }

    UserService.signUser(dispatch, userData, navigate);
  };

  const handleRoleSelect = (role) => {
    setUserType(role);
  };

  const handleBack = () => {
    setCurrentStep("role");
  };

  const nextForm = (role) => {
    setCurrentStep("form");
  };

  // Role Selection Page
  if (currentStep === "role") {
    return (
      <div className="w-100 h-[100vh] overflow-y-scroll">
        <header className="py-4 px-3 container">
          <img src={Logo} alt="" />
        </header>
        <main className="w-100 flex justify-center py-5">
          <div className="bg-[#fff] border-[2px] border-[#E5E7EB] p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-center mb-6">
              Ro'lni tanlang
            </h2>

            <div className="flex flex-col gap-4 mb-6">
              <button
                className={`py-4 rounded-lg text-lg ${
                  userType === "student"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleRoleSelect("student")}
              >
                O'quvchi sifatida ro'yxatdan o'tish
              </button>

              <button
                className={`py-4 rounded-lg text-lg ${
                  userType === "teacher"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleRoleSelect("teacher")}
              >
                O'qituvchi sifatida ro'yxatdan o'tish
              </button>

              <button
                disabled={userType == null}
                onClick={() => nextForm()}
                className={`w-full  bg-blue-600 text-white text-lg font-semibold py-2 rounded-full hover:bg-blue-700 transition ${
                  userType == null ? "opacity-[0.4]" : "opacity-1"
                }`}
              >
                Tasdiqlash
              </button>
            </div>

            {isMobile && (
              <div className="text-center mt-4">
                <Link to="/auth/login" className="text-blue-500">
                  Sizda account bormi? Kirish
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Registration Form Page
  return (
    <div className="w-full h-[100vh] overflow-y-scroll">
      <header className="py-4 px-4 container">
        <img src={Logo} alt="" />
      </header>
      <main className="w-100 flex justify-center py-5">
        <div className="bg-[#fff] border-[2px] border-[#E5E7EB] p-6 rounded-lg w-full max-w-md">
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">Ism*</label>
            <input
              type="text"
              name="firstname"
              required
              value={formData.firstname}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 p-2 px-3 rounded-md border border-[#E5E7EB] focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">
              Familiya*
            </label>
            <input
              type="text"
              name="lastname"
              required
              value={formData.lastname}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 p-2 px-3 rounded-md border border-[#E5E7EB] focus:outline-none focus:border-blue-600"
            />
          </div>

          {userType === "student" && (
            <>
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">
                  Nechinchi kurs*
                </label>
                <input
                  type="text"
                  name="level"
                  required
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full bg-white text-gray-800 p-2 px-3 rounded-md border border-[#E5E7EB] focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">
                  Oqish joyingiz*
                </label>
                <input
                  type="text"
                  name="school"
                  required
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full bg-white text-gray-800 p-2 px-3 rounded-md border border-[#E5E7EB] focus:outline-none focus:border-blue-600"
                />
              </div>
            </>
          )}

          {userType === "teacher" && (
            <>
              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">
                  Ish joyi*
                </label>
                <input
                  type="text"
                  name="workplace"
                  required
                  value={formData.workplace}
                  onChange={handleChange}
                  className="w-full bg-white text-gray-800 p-2 px-3 rounded-md border border-[#E5E7EB] focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">
                  Lavozimi*
                </label>
                <input
                  type="text"
                  name="rank"
                  required
                  value={formData.rank}
                  onChange={handleChange}
                  className="w-full bg-white text-gray-800 p-2 px-3 rounded-md border border-[#E5E7EB] focus:outline-none focus:border-blue-600"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">Login*</label>
            <input
              type="text"
              name="login"
              required
              value={formData.login}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 p-2 px-3 rounded-md border border-[#E5E7EB] focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-2 block">Parol*</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 p-2 px-3 rounded-md border border-[#E5E7EB] focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            onClick={registerHandler}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-full hover:bg-blue-700 transition"
          >
            {isLoading ? "Yuborilmoqda" : "Ro'yxatdan o'tish"}
          </button>

          {!isMobile && (
            <div className="text-center mt-4">
              <Link to="/auth/login" className="text-blue-500">
                Sizda account bormi? Kirish
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
