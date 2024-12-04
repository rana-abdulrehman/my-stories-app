import React, { useState, useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginApi, ForgotPasswordApi, ResetPasswordApi } from '../../endPoints/post.endPoints';
import { UserContext } from '../../context/UserContext';
import { LoginFromType } from '@/types';

interface ResetPasswordForm {
  token: string;
  newPassword: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState<'login' | 'forgotPassword' | 'resetPassword'>('login');
  const [resetToken, setResetToken] = useState('');
  const { login } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFromType>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
    reset: resetReset,
  } = useForm<ResetPasswordForm>();

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
      reset();
      if (user.role === 'admin') {
        navigate('/admin-board');
      } else {
        navigate('/create-post');
      }
    }).catch(error => {
      toast.error(error.response?.data?.error || 'Wrong Email or Password');
    });
  };

  const handleForgotPassword = (data: { email: string }) => {
    ForgotPasswordApi({ email: data.email })
      .then(response => {
        toast.success('Reset token generated. Check your email.');
        setResetToken(response.data.resetToken);
        setFormType('resetPassword');
        resetReset();
      })
      .catch(error => {
        console.error('Forgot Password Error:', error.response?.data?.error || error);
        const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
        toast.error(errorMessage);
      });
  };

  const handleResetPassword = (data: ResetPasswordForm) => {
    ResetPasswordApi({ token: resetToken, newPassword: data.newPassword })
      .then(response => {
        toast.success('Password reset successfully. Redirecting to login...');
        setResetToken('');
        resetReset();
        setFormType('login');
      })
      .catch(error => {
        console.error('Reset Password Error:', error.response?.data?.error || error);
        const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
        toast.error(errorMessage);
      });
  };

  const renderForm = () => {
    switch (formType) {
      case 'login':
        return (
          <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit(handleLogin)}>
            <div className="mb-12">
              <h3 className="text-blue-500 md:text-3xl text-2xl font-extrabold max-md:text-center">Login</h3>
            </div>
            <div>
              <label className="text-gray-800 text-xs block mb-2">Email</label>
              <div className="relative flex items-center">
                <input id="email"
                  type="email"
                  className={`w-full bg-transparent text-sm border-b focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.email ? "border-red-600" : "border-gray-300"}`}
                  placeholder="Enter email"
                  {...register("email", { required: true })}
                />
                {errors.email && <p className='text-red-600 text-xs mt-1'>Email cannot be empty</p>}
              </div>
            </div>
            <div className="mt-6">
              <label className="text-gray-800 text-xs block mb-2">Password</label>
              <div className="relative flex items-center">
                <input id="password"
                  type="password"
                  className={`w-full bg-transparent text-sm border-b focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.password ? "border-red-600" : "border-gray-300"}`}
                  placeholder="Enter password"
                  {...register("password", { required: true })}
                />
                {errors.password && <p className='text-red-600 text-xs mt-1'>Password cannot be empty</p>}
              </div>
            </div>
            <div className="flex items-center mt-6">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 rounded" />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                Remember me
              </label>
            </div>
            <div className="mt-12">
              <button type="submit" className="w-full py-3 px-6 text-sm tracking-wider font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none">
                Login
              </button>
              <p className="text-sm mt-6 text-gray-800">Don't have an account? <a href="signup" className="text-blue-500 font-semibold hover:underline ml-1">Sign up here</a></p>
              <p className="text-sm mt-6 text-gray-800">Forgot your password? <a href="#" onClick={() => setFormType('forgotPassword')} className="text-blue-500 font-semibold hover:underline ml-1">Reset here</a></p>
            </div>
          </form>
        );
      case 'forgotPassword':
        return (
          <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit(handleForgotPassword)}>
            <div className="mb-12">
              <h3 className="text-blue-500 md:text-3xl text-2xl font-extrabold max-md:text-center">Forgot Password</h3>
            </div>
            <div>
              <label className="text-gray-800 text-xs block mb-2">Email</label>
              <div className="relative flex items-center">
                <input id="email"
                  type="email"
                  className={`w-full bg-transparent text-sm border-b focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.email ? "border-red-600" : "border-gray-300"}`}
                  placeholder="Enter email"
                  {...register("email", { required: true })}
                />
                {errors.email && <p className='text-red-600 text-xs mt-1'>Email cannot be empty</p>}
              </div>
            </div>
            <div className="mt-12">
              <button type="submit" className="w-full py-3 px-6 text-sm tracking-wider font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none">
                Send Reset Link
              </button>
              <p className="text-sm mt-6 text-gray-800">Remember your password? <a href="#" onClick={() => setFormType('login')} className="text-blue-500 font-semibold hover:underline ml-1">Login here</a></p>
            </div>
          </form>
        );
      case 'resetPassword':
        return (
          <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmitReset(handleResetPassword)}>
            <div className="mb-12">
              <h3 className="text-blue-500 md:text-3xl text-2xl font-extrabold max-md:text-center">Reset Password</h3>
            </div>
            <div>
              <label className="text-gray-800 text-xs block mb-2">New Password</label>
              <div className="relative flex items-center">
                <input id="newPassword"
                  type="password"
                  className={`w-full bg-transparent text-sm border-b focus:border-blue-500 px-2 py-3 outline-none
                  ${errorsReset.newPassword ? "border-red-600" : "border-gray-300"}`}
                  placeholder="Enter new password"
                  {...registerReset("newPassword", { required: true })}
                />
                {errorsReset.newPassword && <p className='text-red-600 text-xs mt-1'>New password cannot be empty</p>}
              </div>
            </div>
            <div className="mt-12">
              <button type="submit" className="w-full py-3 px-6 text-sm tracking-wider font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none">
                Reset Password
              </button>
              <p className="text-sm mt-6 text-gray-800">Remember your password? <a href="#" onClick={() => setFormType('login')} className="text-blue-500 font-semibold hover:underline ml-1">Login here</a></p>
            </div>
          </form>
        );
    }
  };

  useEffect(() => {
    reset();
    resetReset();
  }, [formType]);

  return (
    <div className="font-[sans-serif] bg-white md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="flex items-center p-6 h-full w-full">
          {renderForm()}
        </div>
        <div className="max-md:order-1 p-4 bg-gray-50 h-full">
          <img src="https://readymadeui.com/signin-image.webp" className="lg:max-w-[90%] w-full h-full object-contain block mx-auto" alt="login-image" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

