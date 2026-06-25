import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForgotPasswordMutation } from '@/features/auth/services/auth.service.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
    defaultValues: {
      email: '',
    },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden md:flex">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
            alt="Forgot Password"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-10 text-white">
            <h2 className="text-4xl font-bold mb-3">Forgot Your Password?</h2>

            <p className="text-gray-200 text-sm leading-relaxed">
              No worries. Enter your email address and we&apos;ll send you instructions to reset
              your password securely.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>

              <p className="text-gray-500 mt-2 leading-relaxed">
                Please enter the email associated with your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
                {errors.email && (
                  <p className="text-red-500 text-left text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg ${
                  isSubmitDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700 hover:shadow-blue-200'
                }`}
              >
                {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:underline font-medium">
                ← Back to Login
              </Link>
            </div>

            {/* Extra Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                If you don&apos;t receive an email within a few minutes, please check your spam
                folder or try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
