interface SocialLoginProps {
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
}

export function SocialLogin({ onGoogleLogin, onFacebookLogin }: SocialLoginProps) {
  return (<>
    {/* Social Login */}
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={onGoogleLogin}
        className="border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition cursor-pointer">
        <img
          src="https://img.icons8.com/3d-fluency/1200/google-logo.jpg"
          alt="Google Icon"
          className="w-5 h-5 mr-2 inline-block"
        />{' '}
        Google
      </button>

      <button
        onClick={onFacebookLogin}
        className="border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition cursor-pointer">
        <img
          src="https://img.magnific.com/premium-psd/facebook-logo-icon_705838-12833.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Facebook Icon"
          className="w-8 h-8 mr-2 inline-block"
        />{' '}
        Facebook
      </button>
    </div>
  </>);
}
