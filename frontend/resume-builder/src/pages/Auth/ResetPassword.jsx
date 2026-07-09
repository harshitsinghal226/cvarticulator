import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuShieldCheck } from "react-icons/lu";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD(token), {
        password,
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
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F5F3F0] via-[#E8E4DC] to-[#CDBFA5]/30 dark:from-[#111418] dark:via-[#1A1F26] dark:to-[#1C2330] flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-md bg-white/80 dark:bg-[#1C2330]/80 backdrop-blur-md rounded-2xl border-2 border-[#CDBFA5]/30 dark:border-[#9C8D7F]/20 shadow-2xl p-8 transition-colors">
        {!success ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#9C8D7F] to-[#CDBFA5] rounded-xl shadow-md">
                <LuShieldCheck className="text-xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3440] dark:text-gray-100">
                Reset Your Password
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
              Enter your new password below. Must be at least 8 characters.
            </p>

            <form onSubmit={handleSubmit}>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="New Password"
                placeholder="min 8 characters"
                type="password"
              />

              <Input
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
                label="Confirm New Password"
                placeholder="re-enter your password"
                type="password"
              />

              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg">
              <LuShieldCheck className="text-3xl text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3440] dark:text-gray-100 mb-2">
              Password Reset Successful!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Your password has been updated. You can now log in with your new password.
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate("/", { state: { openLogin: true } })}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
