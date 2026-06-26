import { useState, useEffect } from 'react';
import { ArrowUpIcon } from 'lucide-react';

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-12 right-12 p-3 bg-cine-cyan text-black rounded-full shadow-glow-cyan hover:brightness-110 focus:outline-none transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <ArrowUpIcon className="w-5 h-5" />
    </button>
  );
}

export default BackToTop;
