import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCheckDuplicateEmail,
  useCheckDuplicateUsername,
  useRegisterMutation,
} from '@/features/auth/services/auth.service.ts';
import { type RegisterRequest } from '@/features/auth/types/auth.types.ts';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from '@/features/auth/hooks/auth.hooks.ts';
import type { RegisterFormData } from '@/features/auth/utils/register.schema.ts';
import { registerSchema } from '@/features/auth/utils/register.schema.ts';
import {
  AuthLayout,
  authInputClass,
  authLabelClass,
  authButtonClass,
  authButtonDisabledClass,
  authSocialButtonClass,
} from '@/components/layout/AuthLayout';
import { AUTH_IMAGES } from '@/features/auth/constants/auth.images';

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
    <AuthLayout
      wide
      image={AUTH_IMAGES.register}
      imageAlt="Photography equipment"
      title="Join Our Creative Community"
      subtitle="Create your account and start renting professional cameras, lenses, and production gear."
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-gray-500 mt-2">Fill in your information to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Fullname */}
                <div>
                  <label
                    htmlFor="fullName"
                    className={authLabelClass}
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    placeholder=""
                    className={authInputClass}
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-left text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className={authLabelClass}
                  >
                    Username
                  </label>

                  <input
                    type="text"
                    id="username"
                    {...register('username')}
                    placeholder=""
                    className={authInputClass}
                  />
                  {usernameLoading && (
                    <p className="text-gray-500 text-left text-sm mt-1">Checking username...</p>
                  )}
                  {usernameCheck === true && (
                    <p className="text-red-400 text-left text-sm mt-1">Username already exists</p>
                  )}
                  {errors.username && (
                    <p className="text-red-400 text-left text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className={authLabelClass}
                  >
                    Phone Number
                  </label>

                  <input
                    type="text"
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    placeholder=""
                    className={authInputClass}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-400 text-left text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={authLabelClass}
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={authInputClass}
                  />
                  {emailLoading && (
                    <p className="text-gray-500 text-left text-sm mt-1">Checking email...</p>
                  )}
                  {emailCheck === true && (
                    <p className="text-red-400 text-left text-sm mt-1">Email already exists</p>
                  )}
                  {errors.email && (
                    <p className="text-red-400 text-left text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className={authLabelClass}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...register('password')}
                      className={`${authInputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cine-cyan transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-left text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className={authLabelClass}
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      className={`${authInputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cine-cyan transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-left text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

          <div className="flex items-start gap-3 text-sm text-gray-400">
            <input type="checkbox" className="mt-1 accent-cine-cyan" />
            <p>
              I agree to the{' '}
              <a href="#" className="text-cine-cyan hover:text-white transition-colors">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-cine-cyan hover:text-white transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`${authButtonClass} ${isSubmitDisabled ? authButtonDisabledClass : ''}`}
          >
            {registerMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-gray-500">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className={authSocialButtonClass}>
            <img src="https://img.icons8.com/3d-fluency/1200/google-logo.jpg" alt="Google" className="w-5 h-5" />
            Google
          </button>
          <button type="button" className={authSocialButtonClass}>
            <img src="https://img.magnific.com/premium-psd/facebook-logo-icon_705838-12833.jpg?semt=ais_hybrid&w=740&q=80" alt="Facebook" className="w-6 h-6" />
            Facebook
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-cine-cyan font-medium hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
    </AuthLayout>
  );
}
