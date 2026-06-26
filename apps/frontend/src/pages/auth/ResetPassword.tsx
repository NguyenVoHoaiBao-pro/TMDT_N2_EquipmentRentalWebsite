import { useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { passwordRegex } from '@/features/auth/utils/auth.utils.ts';
import { useResetPasswordMutation } from '@/features/auth/services/auth.service.ts';
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

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    confirmNewPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
      });
    }
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  const resetPasswordMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { newPassword: '', confirmNewPassword: '' },
  });

  const isSubmitDisabled =
    !resetToken || !isDirty || !isValid || isSubmitting || resetPasswordMutation.isPending;

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!resetToken) return;
    resetPasswordMutation.mutate({ token: resetToken, newPassword: data.newPassword });
  };

  return (
    <AuthLayout
      image={AUTH_IMAGES.forgotPassword}
      imageAlt="Reset password"
      title="Create New Password"
      subtitle="Your new password should be strong and secure to protect your account."
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-500 mt-2 leading-relaxed">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!resetToken && (
          <div className="glass-panel border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-xl text-sm" role="alert">
            Token is outdated or invalid. Please request a new password reset.
          </div>
        )}

        <div>
          <label htmlFor="newPassword" className={authLabelClass}>
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            {...register('newPassword')}
            placeholder="••••••••"
            className={authInputClass}
          />
          {errors.newPassword && (
            <p className="text-red-400 text-left text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className={authLabelClass}>
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            {...register('confirmNewPassword')}
            placeholder="••••••••"
            className={authInputClass}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-400 text-left text-sm mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`${authButtonClass} ${isSubmitDisabled ? authButtonDisabledClass : ''}`}
        >
          {resetPasswordMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Resetting...
            </span>
          ) : (
            'Reset Password'
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
          Make sure your password contains uppercase, lowercase, numbers, and special characters for
          better security.
        </p>
      </div>
    </AuthLayout>
  );
}
