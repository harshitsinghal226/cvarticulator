import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import { LuArrowLeft, LuShieldCheck } from "react-icons/lu";

const SignUp = ({ setCurrentPage }) => {
  const [step, setStep] = useState("signup"); // "signup" | "verify"
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Cooldown countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle Sign Up Form Submit (Sends OTP)
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Sign Up API Call
    try {
      // Upload profile picture if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      // Move to verification step
      setStep("verify");
      setResendTimer(60);
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

  // Handle OTP Code Verification Submit
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Verification failed. Please check the code and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resending OTP Code
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setError("");

    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email });
      setResendTimer(60);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to resend verification code. Please try again.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center bg-white rounded-2xl transition-colors">
      {step === "signup" ? (
        <>
          <h3 className="text-lg font-semibold text-[#2C3440]">Create an Account</h3>
          <p className="text-xs text-slate-600 mt-[5px] mb-6">
            Join us today by entering your details below to create your account.
          </p>

          <form onSubmit={handleSignUp}>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

            <div className="grid grid-cols-1 gap-2">
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="Harshit Singhal"
                type="text"
              />

              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="harshit@example.com"
                type="text"
              />

              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="min 8 characters"
                type="password"
              />
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Signing Up..." : "SIGN UP"}
            </button>

            <p className="text-[13px] text-slate-600 mt-3">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-primary underline cursor-pointer"
                onClick={() => {
                  setCurrentPage("login");
                }}
              >
                Login
              </button>
            </p>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setStep("signup")}
            >
              <LuArrowLeft className="text-lg text-slate-700" />
            </button>
            <h3 className="text-lg font-semibold text-[#2C3440]">Verify Email</h3>
          </div>
          <p className="text-xs text-slate-600 mt-[5px] mb-6 leading-relaxed">
            We've sent a 6-digit verification code to <strong className="text-black">{email}</strong>.
          </p>

          <form onSubmit={handleVerifyOTP}>
            <Input
              value={otp}
              onChange={({ target }) => setOtp(target.value.replace(/\D/g, "").slice(0, 6))}
              label="Verification Code"
              placeholder="123456"
              type="text"
            />

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Verifying..." : "VERIFY EMAIL"}
            </button>

            <div className="flex items-center justify-between text-[13px] text-slate-600 mt-4">
              <span>Didn't receive the code?</span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className={`font-semibold cursor-pointer select-none ${
                  resendTimer > 0 ? "text-slate-500" : "text-primary hover:underline"
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SignUp;
