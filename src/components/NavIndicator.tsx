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
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-auto"
      style={{ right: 'calc(10px + env(safe-area-inset-right, 0px))' }}
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
            className="group relative flex items-center justify-center p-1.5 focus:outline-none"
          >
            {/* Tooltip on left */}
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm border border-[#C9A24D]/30 px-2 py-0.5 rounded text-[10px] tracking-[0.2em] font-['Jost'] uppercase text-[#9C7424] pointer-events-none shadow-sm whitespace-nowrap">
              0{idx + 1} {sec.label}
            </span>

            {/* Dot */}
            <div
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-2.5 h-6 bg-gradient-to-b from-[#E9D08F] to-[#C9A24D] shadow-[0_2px_8px_rgba(201,162,77,0.5)]'
                  : 'w-2 h-2 bg-[#C9A24D]/35 hover:bg-[#C9A24D]/70'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};

