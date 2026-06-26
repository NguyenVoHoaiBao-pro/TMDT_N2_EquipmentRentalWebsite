import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  Aperture,
  Lightbulb,
  Zap,
  Play,
  Shield,
  Truck,
  Headphones,
  Star,
  Loader2,
} from 'lucide-react';
import SiteLayout from '@/components/layout/SiteLayout';
import ProductGrid from '@/features/product/components/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { mapApiProductsToLocal } from '@/features/product/utils/product.mapper';
import { useState } from 'react';

const HERO_IMAGE = '/images/hero-cinema.png';

const specs = [
  { label: 'Resolution', value: '8K Native' },
  { label: 'Dynamic Range', value: '17+ Stops' },
  { label: 'Support', value: '24/7 Tech' },
];

const steps = [
  {
    step: '01',
    title: 'Browse Inventory',
    description: 'Filter by brand, category, and daily rate across our full catalog.',
  },
  {
    step: '02',
    title: 'Book Your Shoot',
    description: 'Select rental dates, review specs, and confirm your order online.',
  },
  {
    step: '03',
    title: 'Shoot & Return',
    description: 'Pick up or get delivery — every unit inspected and ready to roll.',
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Cinema-Grade QC',
    description: 'Every body and lens calibrated before each rental cycle.',
  },
  {
    icon: Truck,
    title: 'On-Set Delivery',
    description: 'Same-day dispatch to studios and locations nationwide.',
  },
  {
    icon: Headphones,
    title: '24/7 Tech Desk',
    description: 'On-call engineers for firmware, rigging, and troubleshooting.',
  },
  {
    icon: Star,
    title: 'Trusted on Set',
    description: 'Used by DPs, gaffers, and production houses across Vietnam.',
  },
];

const categoryIcons: Record<string, typeof Camera> = {
  Cameras: Camera,
  Lens: Aperture,
  Lenses: Aperture,
  Lighting: Lightbulb,
  Accessories: Lightbulb,
};

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useProducts(0, 200);

  const products = useMemo(
    () => mapApiProductsToLocal(data?.content ?? []),
    [data],
  );

  const featuredProducts = products.slice(0, 6);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return unique.slice(0, 3).map((name) => ({
      name,
      icon: categoryIcons[name] ?? Camera,
      count: products.filter((p) => p.category === name).length,
      description: `Professional ${name.toLowerCase()} for rent`,
    }));
  }, [products]);

  return (
    <SiteLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-end overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Professional cinema camera"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-cine-radial" />
        <div className="absolute inset-0 bg-gradient-to-r from-cine-bg via-cine-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-transparent to-cine-bg/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-8 w-full flex-1 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 glass-badge">
              <span className="w-2 h-2 rounded-full bg-cine-cyan shadow-glow-cyan-sm animate-pulse" />
              <span className="font-sora text-xs font-medium text-cine-cyan tracking-wide uppercase">
                Now Available: Alexa 35
              </span>
            </div>

            <h1 className="font-sora text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Rent the
              <br />
              <span className="text-cine-cyan text-glow-cyan">Future</span>
            </h1>

            <p className="font-sora text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg">
              Access the world&apos;s most advanced cinematography gear. From Hollywood-grade
              cameras to precision optics, we provide the tools to capture your vision.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/products" className="cine-btn-primary">
                Browse Inventory
              </Link>
              <Link to="/products" className="cine-btn-glass">
                <Play className="w-4 h-4" />
                View Showreel
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/8 bg-cine-bg/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 grid grid-cols-3 gap-4">
            {specs.map((spec) => (
              <div key={spec.label} className="text-center sm:text-left">
                <p className="font-sora text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-1">
                  {spec.label}
                </p>
                <p className="font-sora text-sm sm:text-xl font-bold text-white">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cine-bg to-cine-surface" />
          <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
            <div className="mb-14">
              <p className="font-sora text-cine-cyan text-sm font-medium uppercase tracking-widest mb-3">
                Departments
              </p>
              <h2 className="font-sora text-3xl sm:text-4xl font-bold text-white">
                Explore the Gear
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group glass-panel rounded-2xl p-8 hover:border-cine-cyan/30 hover:shadow-glow-cyan-sm transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-cine-cyan/10 text-cine-cyan flex items-center justify-center mb-6 group-hover:bg-cine-cyan group-hover:text-black transition-all duration-300">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-sora text-xl font-semibold text-white mb-2 group-hover:text-cine-cyan transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-sora text-sm text-gray-500 mb-4">{cat.description}</p>
                  <p className="font-sora text-xs text-cine-cyan font-medium">{cat.count} units available</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-24 bg-cine-surface relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cine-cyan/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <div>
              <p className="font-sora text-cine-cyan text-sm font-medium uppercase tracking-widest mb-3">
                Hot Rentals
              </p>
              <h2 className="font-sora text-3xl sm:text-4xl font-bold text-white">
                Featured Equipment
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-sora text-sm text-cine-cyan hover:text-white transition-colors"
            >
              Full inventory
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-cine-cyan animate-spin" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <p className="text-center text-gray-500 font-sora py-12">No products available yet.</p>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cine-surface to-cine-bg" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-sora text-cine-cyan text-sm font-medium uppercase tracking-widest mb-3">
              Process
            </p>
            <h2 className="font-sora text-3xl sm:text-4xl font-bold text-white">
              From Browse to Roll
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="glass-panel rounded-2xl p-8 relative overflow-hidden group hover:border-cine-cyan/20 transition-all"
              >
                <span className="font-sora text-6xl font-bold text-white/5 absolute top-4 right-6 group-hover:text-cine-cyan/10 transition-colors">
                  {item.step}
                </span>
                <div className="relative">
                  <span className="font-sora text-cine-cyan text-sm font-bold">{item.step}</span>
                  <h3 className="font-sora text-xl font-semibold text-white mt-3 mb-3">
                    {item.title}
                  </h3>
                  <p className="font-sora text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-cine-surface">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-sora text-cine-cyan text-sm font-medium uppercase tracking-widest mb-3">
              Why LenleasesVN
            </p>
            <h2 className="font-sora text-3xl sm:text-4xl font-bold text-white">
              Built for Production
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="glass-panel rounded-2xl p-6 text-center hover:border-cine-cyan/20 transition-all group"
              >
                <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-cine-cyan/10 text-cine-cyan flex items-center justify-center group-hover:shadow-glow-cyan-sm transition-all">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="font-sora font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="font-sora text-sm text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekend Special Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-cine-cyan rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-sora text-black font-bold text-lg">Weekend Special</p>
              <p className="font-sora text-black/70 text-sm">15% off all lens rentals this weekend</p>
            </div>
            <Link
              to="/products"
              className="font-sora text-sm font-semibold bg-black text-cine-cyan px-6 py-2.5 rounded-full hover:bg-cine-bg transition-colors"
            >
              Shop Deals
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cine-surface to-cine-bg" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-cine-cyan/20 p-10 lg:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cine-midnight/80 to-cine-bg" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,0.08)_0%,transparent_70%)]" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cine-cyan/10 border border-cine-cyan/30 shadow-glow-cyan-sm">
                <Zap className="w-7 h-7 text-cine-cyan" />
              </div>
              <h2 className="font-sora text-3xl sm:text-4xl font-bold text-white">
                Ready to Roll Camera?
              </h2>
              <p className="font-sora text-gray-400 text-lg">
                Create a free account to book gear, track orders, and manage your production rentals.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link to="/register" className="cine-btn-primary">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="cine-btn-glass">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
