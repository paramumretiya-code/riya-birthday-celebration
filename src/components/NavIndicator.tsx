import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'cover-section', label: 'Cover' },
  { id: 'wishes-section', label: 'Wishes' },
  { id: 'cake-section', label: 'Cake' },
];

export const NavIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('cover-section');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.4;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 pointer-events-auto"
      style={{ right: 'calc(4px + env(safe-area-inset-right, 0px))' }}
      aria-label="Section navigation"
    >
      {SECTIONS.map((sec, idx) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            title={`Scroll to ${sec.label}`}
            aria-label={`Scroll to ${sec.label}`}
            className="group relative flex items-center justify-center w-12 h-12 min-w-[48px] min-h-[48px] focus:outline-none cursor-pointer active:scale-95 transition-transform"
          >
            {/* Tooltip on left (hover-capable devices only) */}
            <span className="hidden sm:block absolute right-12 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm border border-[#C9A24D]/30 px-2.5 py-1 rounded text-[10px] tracking-[0.2em] font-['Jost'] uppercase text-[#9C7424] pointer-events-none shadow-sm whitespace-nowrap">
              0{idx + 1} {sec.label}
            </span>

            {/* Dot */}
            <div
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-2.5 h-6 bg-gradient-to-b from-[#E9D08F] to-[#C9A24D] shadow-[0_2px_8px_rgba(201,162,77,0.5)]'
                  : 'w-2.5 h-2.5 bg-[#C9A24D]/40 group-hover:bg-[#C9A24D]/80'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
