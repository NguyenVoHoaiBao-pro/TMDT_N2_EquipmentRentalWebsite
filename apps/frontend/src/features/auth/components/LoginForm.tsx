import { Link } from 'react-router-dom';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation, useSocialLogin } from '@/features/auth/services/auth.service.ts';
import { passwordRegex } from '@/features/auth/utils/auth.utils.ts';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { SocialLogin } from '@/components/layout/SocialLogin.tsx';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z
    .string()
    .min(8, { message: 'Password is at least 8 characters' })
    .regex(passwordRegex, {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();
  const { loginWithGoogle, loginWithFacebook } = useSocialLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting || loginMutation.isPending;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side - Image */}
        <div className="relative hidden md:block">
          <img
            src="https://www.iphotography.com/wp-content/uploads/2023/06/Best-Cameras-for-Professional-Photography-6.jpg"
            alt="Camera"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
            <h2 className="text-4xl font-bold mb-2">Capture Every Moment</h2>

            <p className="text-sm text-gray-200 leading-relaxed">
              Sign in to manage your photography bookings, portfolios, and creative projects.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>

              <p className="text-gray-500 mt-2">Please login to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm text-left font-medium text-gray-700 mb-2"
                >
                  Username
                </label>

                <input
                  type="text"
                  id="username"
                  {...register('username')}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
                {errors.username && (
                  <p className="text-red-500 text-left text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-left font-medium text-gray-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password')}
                    placeholder="••••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-left text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="accent-blue-500" />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-blue-200 ${
                  isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 shadow-lg'
                }`}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <SocialLogin
              onGoogleLogin={loginWithGoogle}
              onFacebookLogin={loginWithFacebook}
            />

            {/* Register */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
