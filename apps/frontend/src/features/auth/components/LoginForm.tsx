import { Link } from 'react-router-dom';

export function LoginForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
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

            <form className="space-y-5">
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
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
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
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="accent-blue-500" />
                  Remember me
                </label>

                <a href="#" className="text-blue-500 hover:text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-200"
              >
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR</span>
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
