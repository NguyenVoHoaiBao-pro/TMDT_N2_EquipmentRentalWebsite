import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Regex constants (Kept only what Zod doesn't have native primitives for)
const fullNameRegex = /^[a-zA-Z\s]+$/;
const phoneRegex = /^[0-9]{10}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: 'Full name is required' })
      .regex(fullNameRegex, { message: 'Full name must contain only letters and spaces' }),

    username: z.string().min(1, { message: 'Username is required' }),

    phoneNumber: z
      .string()
      .min(1, { message: 'Phone number is required' })
      .regex(phoneRegex, { message: 'Phone number must be exactly 10 digits' }),

    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),

    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm password must be at least 8 characters' }),
  })
  // superRefine is now clean and dedicated ONLY to cross-field validation
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'], // Correctly maps the error to the confirmPassword UI field
      });
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

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
            <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-5">
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
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
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

                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
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

                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-200"
              >
                Create Account
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
