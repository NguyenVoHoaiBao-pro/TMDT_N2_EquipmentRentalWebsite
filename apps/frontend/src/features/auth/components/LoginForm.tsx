import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/features/auth/services/auth.service.ts';
import { passwordRegex } from '@/features/auth/utils/auth.utils.ts';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  AuthLayout,
  authInputClass,
  authLabelClass,
  authButtonClass,
  authButtonDisabledClass,
  authSocialButtonClass,
} from '@/components/layout/AuthLayout';
import { AUTH_IMAGES } from '@/features/auth/constants/auth.images';

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { username: '', password: '' },
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
    <AuthLayout
      image={AUTH_IMAGES.login}
      imageAlt="Professional camera"
      title="Capture Every Moment"
      subtitle="Sign in to manage your equipment rentals, bookings, and creative projects."
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Please login to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="username" className={authLabelClass}>
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register('username')}
            placeholder="Enter your username"
            className={authInputClass}
          />
          {errors.username && (
            <p className="text-red-400 text-left text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={authLabelClass}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password')}
              placeholder="••••••••••"
              className={`${authInputClass} pr-12`}
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-400">
            <input type="checkbox" className="accent-cine-cyan" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-cine-cyan hover:text-white transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`${authButtonClass} ${isSubmitDisabled ? authButtonDisabledClass : ''}`}
        >
          {loginMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button type="button" className={authSocialButtonClass}>
          <img
            src="https://img.icons8.com/3d-fluency/1200/google-logo.jpg"
            alt="Google"
            className="w-5 h-5"
          />
          Google
        </button>
        <button type="button" className={authSocialButtonClass}>
          <img
            src="https://img.magnific.com/premium-psd/facebook-logo-icon_705838-12833.jpg?semt=ais_hybrid&w=740&q=80"
            alt="Facebook"
            className="w-6 h-6"
          />
          Facebook
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-cine-cyan font-medium hover:text-white transition-colors">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
