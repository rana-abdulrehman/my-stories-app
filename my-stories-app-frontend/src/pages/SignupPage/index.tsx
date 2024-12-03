import { Signup } from '@/types';
import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SignupApi } from '../../endPoints/post.endPoints';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Signup>()

  const handleSignup = (data: Signup) => {
    SignupApi({
      name: data.name,
      email: data.email,
      password: data.password,
    }).then(response => {
      toast.success('Account created successfully. Redirecting to login...');
      if (response) {
        reset();
        navigate('/login');
      }
    }).catch(error => {
      console.error('Signup Error:', error.response?.data?.error || error);
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
      toast.error(errorMessage); 
    });
  };

  return (
    <div className="font-[sans-serif] bg-white md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 p-4 bg-gray-50 h-full">
          <img src="https://readymadeui.com/signin-image.webp" className="lg:max-w-[90%] w-full h-full object-contain block mx-auto" alt="login-image" />
        </div>
        <div className="flex items-center p-6 h-full w-full">
          <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit(handleSignup)}>
            <div className="mb-12">
              <h3 className="text-blue-500 md:text-3xl text-2xl font-extrabold max-md:text-center">Create an account</h3>
            </div>
            <div>
              <label className="text-gray-800 text-xs block mb-2">Full Name</label>
              <div className="relative flex items-center">
                <input
                  id="name" type="text"
                  className={`w-full bg-transparent text-sm border-b  focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.name ? "border-red-600" : "border-gray-300"}
                  `}
                  placeholder="Enter name"
                  {...register("name", { required: true })}
                />
                {errors.name ?
                  <p className='text-red-600 text-xs mt-1'>Name cannot be empty</p>
                  : null}
              </div>
            </div>
            <div className="mt-6">
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
                  <p className='text-red-600 text-xs mt-1'> Email cannot be empty</p>
                  : null}
              </div>
            </div>
            <div className="mt-6">
              <label className="text-gray-800 text-xs block mb-2">Password</label>
              <div className="relative flex items-center">
                <input id="password"
                  type="password"
                  className={`w-full bg-transparent text-sm border-b  focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.name ? "border-red-600" : "border-gray-300"}`}
                  placeholder="Enter password"
                  {...register("password", { required: true })} />
                {errors.password ?
                  <p className='text-red-600 text-xs mt-1'>Password cannot be empty</p>
                  : null}
              </div>
            </div>
            <div className="flex items-center mt-6">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 rounded" />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                I accept the <a href="javascript:void(0);" className="text-blue-500 font-semibold hover:underline ml-1">Terms and Conditions</a>
              </label>
            </div>
            <div className="mt-12">
              <button type="submit" className="w-full py-3 px-6 text-sm tracking-wider font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none">
                Create an account
              </button>
              <p className="text-sm mt-6 text-gray-800">Already have an account? <a href="login" className="text-blue-500 font-semibold hover:underline ml-1">Login here</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;