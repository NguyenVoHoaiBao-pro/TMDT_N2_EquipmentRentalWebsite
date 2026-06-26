import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForgotPasswordMutation } from '@/features/auth/services/auth.service.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  AuthLayout,
  authInputClass,
  authLabelClass,
  authButtonClass,
  authButtonDisabledClass,
} from '@/components/layout/AuthLayout';
import { AUTH_IMAGES } from '@/features/auth/constants/auth.images';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting || forgotPasswordMutation.isPending;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
    } catch (error) {
      console.error('Forgot password failed:', error);
    }
  };

  return (
    <AuthLayout
      image={AUTH_IMAGES.forgotPassword}
      imageAlt="Forgot password"
      title="Forgot Your Password?"
      subtitle="Enter your email and we'll send you instructions to reset your password securely."
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-500 mt-2 leading-relaxed">
          Please enter the email associated with your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className={authLabelClass}>
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            placeholder="example@gmail.com"
            className={authInputClass}
          />
          {errors.email && (
            <p className="text-red-400 text-left text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`${authButtonClass} ${isSubmitDisabled ? authButtonDisabledClass : ''}`}
        >
          {forgotPasswordMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link to="/login" className="text-sm text-cine-cyan hover:text-white transition-colors font-medium">
          ← Back to Login
        </Link>
      </div>

      <div className="mt-6 p-4 glass-panel rounded-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          If you don&apos;t receive an email within a few minutes, please check your spam folder or
          try again.
        </p>
      </div>
    </AuthLayout>
  );
}
