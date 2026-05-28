import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCheckDuplicateEmail,
  useCheckDuplicateUsername,
  useRegisterMutation,
} from '@/features/auth/services/auth.service.ts';
import { type RegisterRequest } from '@/features/auth/types/auth.types.ts';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from '@/features/auth/hooks/auth.hooks.ts';
import type { RegisterFormData } from '@/features/auth/utils/register.schema.ts';
import { registerSchema } from '@/features/auth/utils/register.schema.ts';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      username: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 1. Extract realtime value of email and username fields
  const currentUsername = watch('username');
  const currentEmail = watch('email');

  // 2. Create a debounced version of the username and email fields
  const debouncedUsername = useDebounce(currentUsername, 500);
  const debouncedEmail = useDebounce(currentEmail, 500);

  // 3. Take out form state and check if the fields are ready to be touched
  const isUsernameReadyToCheck = touchedFields.username && !errors.username;

  const isEmailReadyToCheck = touchedFields.email && !errors.email;

  // 3. Pass values to the checkDuplicateUsername and checkDuplicateEmail hooks
  const { data: usernameCheck, isLoading: usernameLoading } = useCheckDuplicateUsername(
    debouncedUsername,
    { enabled: isUsernameReadyToCheck && debouncedUsername.length >= 3 }
  );

  const { data: emailCheck, isLoading: emailLoading } = useCheckDuplicateEmail(debouncedEmail, {
    enabled: isEmailReadyToCheck,
  });

  const isSubmitDisabled =
    !isDirty ||
    !isValid ||
    isSubmitting ||
    registerMutation.isPending ||
    usernameLoading ||
    emailLoading;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (emailCheck === true) return;
      if (usernameCheck === true) return;

      const { username, password, email, fullName, phoneNumber } = data;
      await registerMutation.mutateAsync({
        username,
        password,
        email,
        fullName,
        phoneNumber,
      } as RegisterRequest);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side */}
        <div className="hidden md:flex relative">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"
            alt="Photography"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-10 text-white">
            <h2 className="text-4xl font-bold mb-3 leading-tight">Join Our Creative Community</h2>

            <p className="text-gray-200 text-sm leading-relaxed">
              Create your account and start booking photographers, managing projects, and sharing
              your creative moments.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex items-center justify-center">
          <div className="w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>

              <p className="text-gray-500 mt-2">Fill in your information to get started</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Fullname */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm text-left font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    placeholder=""
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-left text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

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
                    placeholder=""
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                  {usernameLoading && (
                    <p className="text-gray-500 text-left text-sm mt-1">Checking username...</p>
                  )}
                  {usernameCheck === true && (
                    <p className="text-red-500 text-left text-sm mt-1">Username already exists</p>
                  )}
                  {errors.username && (
                    <p className="text-red-500 text-left text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm text-left font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>

                  <input
                    type="text"
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    placeholder=""
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-left font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                  {emailLoading && (
                    <p className="text-gray-500 text-left text-sm mt-1">Checking email...</p>
                  )}
                  {emailCheck === true && (
                    <p className="text-red-500 text-left text-sm mt-1">Email already exists</p>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-left text-sm mt-1">{errors.email.message}</p>
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all pr-10"
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm text-left font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-left text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <input type="checkbox" className="mt-1 accent-indigo-500" />

                <p>
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-indigo-200 ${
                  isSubmitDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700 shadow-lg'
                }`}
              >
                {registerMutation.isPending ? (
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition">
                <img
                  src="https://img.icons8.com/3d-fluency/1200/google-logo.jpg"
                  alt="Google Icon"
                  className="w-5 h-5 mr-2 inline-block"
                />{' '}
                Google
              </button>

              <button className="border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition">
                <img
                  src="https://img.magnific.com/premium-psd/facebook-logo-icon_705838-12833.jpg?semt=ais_hybrid&w=740&q=80"
                  alt="Facebook Icon"
                  className="w-8 h-8 mr-2 inline-block"
                />{' '}
                Facebook
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
