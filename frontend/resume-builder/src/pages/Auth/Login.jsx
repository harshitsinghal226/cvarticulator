import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }; 

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center bg-white dark:bg-[#1C2330] rounded-2xl transition-colors'>
      <h3 className='text-lg font-semibold text-black dark:text-gray-100'>Welcome Back</h3>
      <p className='text-xs text-slate-700 dark:text-slate-300 mt-[5px] mb-6'>
        Please enter your details to login to your account.
      </p>

      <form onSubmit={handleLogin}>
        <Input 
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label='Email Address'
          placeholder='harshit@example.com'
          type='text'
        />
        
        <Input 
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label='Password'
          placeholder='min 8 characters'
          type='password'
        />

        <div className='flex justify-end mb-2'>
          <button 
            type='button'
            className='text-[12px] font-medium text-[#9C8D7F] hover:text-[#2C3440] dark:hover:text-[#CDBFA5] underline cursor-pointer transition-colors'
            onClick={() => setCurrentPage("forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          LOGIN
        </button>

        <p className='text-[13px] text-slate-800 dark:text-slate-300 mt-3'>
          Don't have an account?{' '}
          <button 
            className='font-medium text-primary dark:text-[#CDBFA5] underline cursor-pointer'
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
