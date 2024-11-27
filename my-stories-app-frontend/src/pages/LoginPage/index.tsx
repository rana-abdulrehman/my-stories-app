import { LoginFromType } from '@/types';
import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../context/UserContext';
import { LoginApi } from '../../endPoints/post.endPoints';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFromType>()

  const handleLogin = (data: LoginFromType) => {

    LoginApi({
      email: data.email,
      password: data.password
    }).then(response => {
      const { token, user } = response.data;
      const userWithToken = { ...user, token };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithToken));
      login(userWithToken);
      reset()
      if (user.role === 'admin') {
        navigate('/admin-board');
      } else {
        navigate('/create-post');
      }


    }).catch(error => {
      toast.error(error.response?.data?.error || 'Wrong Email or Password');
    })

  };

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="md:max-w-md w-full px-4 py-4">
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="mb-12">
                <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                <p className="text-sm mt-4 text-gray-800">
                  Don't have an account
                  <a
                    href="/signup"
                    className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                  >
                    Register here
                  </a>
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-xs block mb-2">Email</label>
                <div className="relative flex items-center">
                  <input id="email"
                    type="email"
                    className={`w-full bg-transparent text-sm border-b  focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.email ? "border-red-600" : "border-gray-300"}`}
                    placeholder="Enter email"
                    {...register("email", { required: true })}
                  />
                  {errors.email ?
                    <p> Email cannot be empty</p>
                    : null}
                </div>
              </div>
              <div className="mt-8">
                <label className="text-gray-800 text-xs block mb-2">Password</label>
                <div className="relative flex items-center">
                  <input id="password"
                    type="password"
                    className={`w-full bg-transparent text-sm border-b  focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.password ? "border-red-600" : "border-gray-300"}`}
                    placeholder="Enter password"
                    {...register("password", { required: true })} />
                  {errors.password ?
                    <p>Password cannot be empty</p>
                    : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-800"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <a
                    href="/forgot-password"
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
              <div className="mt-12">
                <button
                  type="submit"
                  className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
          <div className="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8">
            <img
              src="https://readymadeui.com/signin-image.webp"
              className="w-full h-full object-contain"
              alt="login-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;