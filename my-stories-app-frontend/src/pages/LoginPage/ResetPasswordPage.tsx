import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ResetPasswordApi } from '../../endPoints/post.endPoints';

interface ResetPasswordForm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetToken, setResetToken] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordForm>();

  const handleResetPassword = (data: ResetPasswordForm) => {
    ResetPasswordApi({ token: resetToken, newPassword: data.newPassword })
      .then(response => {
        toast.success('Password reset successfully. Redirecting to login...');
        reset();
        navigate('/login');
      })
      .catch(error => {
        console.error('Reset Password Error:', error.response?.data?.error || error);
        const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    if (token) {
      setResetToken(token);
    } else {
      toast.error('Invalid reset token. Please request a new reset link.');
      navigate('/login');
    }
  }, [location.search, navigate]);

  const newPassword = watch("newPassword");

  return (
    <div className="font-[sans-serif] bg-white md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="flex items-center p-6 h-full w-full">
          <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit(handleResetPassword)}>
            <div className="mb-12">
              <h3 className="text-blue-500 md:text-3xl text-2xl font-extrabold max-md:text-center">Reset Password</h3>
            </div>
            <div>
              <label className="text-gray-800 text-xs block mb-2">New Password</label>
              <div className="relative flex items-center">
                <input id="newPassword"
                  type="password"
                  className={`w-full bg-transparent text-sm border-b focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.newPassword ? "border-red-600" : "border-gray-300"}`}
                  placeholder="Enter new password"
                  {...register("newPassword", { required: true, minLength: 6 })}
                />
                {errors.newPassword && errors.newPassword.type === "required" && <p className='text-red-600 text-xs mt-1'>New password cannot be empty</p>}
                {errors.newPassword && errors.newPassword.type === "minLength" && <p className='text-red-600 text-xs mt-1'>Password must be at least 6 characters long</p>}
              </div>
            </div>
            <div className="mt-6">
              <label className="text-gray-800 text-xs block mb-2">Confirm Password</label>
              <div className="relative flex items-center">
                <input id="confirmPassword"
                  type="password"
                  className={`w-full bg-transparent text-sm border-b focus:border-blue-500 px-2 py-3 outline-none
                  ${errors.confirmPassword ? "border-red-600" : "border-gray-300"}`}
                  placeholder="Confirm new password"
                  {...register("confirmPassword", {
                    required: true,
                    validate: value => value === newPassword || "The passwords do not match"
                  })}
                />
                {errors.confirmPassword && <p className='text-red-600 text-xs mt-1'>{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <div className="mt-12">
              <button type="submit" className="w-full py-3 px-6 text-sm tracking-wider font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none">
                Reset Password
              </button>
              <p className="text-sm mt-6 text-gray-800">Remember your password? <a href="/login" className="text-blue-500 font-semibold hover:underline ml-1">Login here</a></p>
            </div>
          </form>
        </div>
        <div className="max-md:order-1 p-4 bg-gray-50 h-full">
          <img src="https://readymadeui.com/signin-image.webp" className="lg:max-w-[90%] w-full h-full object-contain block mx-auto" alt="login-image" />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;