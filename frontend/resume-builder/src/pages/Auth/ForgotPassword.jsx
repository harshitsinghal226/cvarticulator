import React, { useState } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuArrowLeft, LuMail } from "react-icons/lu";

const ForgotPassword = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, {
        email,
      });
      setSuccess(true);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center bg-white dark:bg-[#1C2330] rounded-2xl transition-colors">
      {!success ? (
        <>
          <h3 className="text-lg font-semibold text-black dark:text-gray-100">Forgot Password?</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-[5px] mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="harshit@example.com"
              type="text"
            />

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <LuMail className="text-[16px]" />
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-[13px] text-slate-800 dark:text-slate-300 mt-3">
              Remember your password?{" "}
              <button
                className="font-medium text-primary dark:text-[#CDBFA5] underline cursor-pointer"
                onClick={() => setCurrentPage("login")}
                type="button"
              >
                Login
              </button>
            </p>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[#9C8D7F] to-[#CDBFA5] rounded-full shadow-lg">
            <LuMail className="text-3xl text-white" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-gray-100 mb-2">Check Your Email</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            If an account exists for <strong className="text-[#2C3440] dark:text-white">{email}</strong>, you'll receive a password reset link shortly. Please check your inbox and spam folder.
          </p>
          <button
            className="btn-primary"
            onClick={() => setCurrentPage("login")}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
