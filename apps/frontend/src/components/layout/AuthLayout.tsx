import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  title: string;
  subtitle: string;
  wide?: boolean;
}

export function AuthLayout({
  children,
  image,
  imageAlt,
  title,
  subtitle,
  wide = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-cine-bg font-sora flex items-center justify-center p-4 lg:p-6">
      <div
        className={`w-full ${wide ? 'max-w-6xl' : 'max-w-5xl'} bg-cine-card border border-white/8 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2`}
      >
        {image && (
          <div className="relative hidden md:block min-h-[560px]">
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Giữ ảnh gốc rõ, phủ nhẹ để hòa dark theme */}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-cine-bg/25 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-cine-cyan/5 via-transparent to-cine-midnight/30" />

            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-white">
              <Link
                to="/home"
                className="font-sora text-xl font-bold text-white hover:text-cine-cyan transition-colors mb-6 inline-block"
              >
                LenleasesVN
              </Link>
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">{title}</h2>
              <p className="text-sm text-gray-300 leading-relaxed max-w-sm">{subtitle}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center p-8 md:p-10 lg:p-12 bg-cine-card">
          <div className={`w-full ${wide ? 'max-w-xl' : 'max-w-md'}`}>
            <Link
              to="/home"
              className="md:hidden font-sora text-xl font-bold text-white hover:text-cine-cyan transition-colors mb-8 inline-block"
            >
              LenleasesVN
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-cine-cyan/40 focus:shadow-glow-cyan-sm transition-all duration-200';

export const authLabelClass = 'block text-sm text-left font-medium text-gray-300 mb-2';

export const authButtonClass =
  'w-full bg-cine-cyan text-black font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-glow-cyan hover:brightness-110';

export const authButtonDisabledClass = 'opacity-50 cursor-not-allowed';

export const authSocialButtonClass =
  'border border-white/10 rounded-xl py-3 font-medium text-gray-300 hover:bg-white/5 hover:border-cine-cyan/30 hover:text-white transition flex items-center justify-center gap-2';
