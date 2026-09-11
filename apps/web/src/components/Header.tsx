'use client';

import React, { useState, useEffect } from 'react';
import { TargetAppMetadata } from '@foldlens/core-types';
import { ArrowUpRight } from './icons/CustomIcons';
import { useWizard } from '../context/WizardContext';

interface HeaderProps {
  metadata?: TargetAppMetadata;
  readinessScore?: number;
  grade?: string;
  onReScan?: () => void;
}

type NavTarget = 'studio' | 'fold_safety' | 'design_fixer' | 'simulator';

export const Header: React.FC<HeaderProps> = () => {
  const { navigateTo, activeNavTarget, setActiveNavTarget, heroViewMode, capabilitiesTab } = useWizard();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.getElementById('main-scroll-container') || window;
      const scrollTop = 'scrollTop' in scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollPosition = scrollTop + viewportHeight * 0.4;

      const capEl = document.getElementById('capabilities');

      if (capEl && scrollPosition >= capEl.offsetTop) {
        if (capabilitiesTab === 'simulator') {
          setActiveNavTarget('simulator');
        } else {
          setActiveNavTarget('fold_safety');
        }
      } else {
        if (heroViewMode === 'findings') {
          setActiveNavTarget('design_fixer');
        } else {
          setActiveNavTarget('studio');
        }
      }
    };

    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [capabilitiesTab, heroViewMode, setActiveNavTarget]);

  const handleNavClick = (target: NavTarget) => {
    setActiveNavTarget(target);
    navigateTo(target);
    setIsMenuOpen(false);
  };

  const navLinks: { target: NavTarget; label: string }[] = [
    { target: 'studio', label: 'App Studio' },
    { target: 'fold_safety', label: 'Fold Safety' },
    { target: 'design_fixer', label: 'Design Fixer' },
    { target: 'simulator', label: '3D Simulator' }
  ];

  const isLinkActive = (target: NavTarget) => {
    return activeNavTarget === target;
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-[100] flex justify-center items-center px-4 sm:px-6 md:px-8 pointer-events-auto select-none">
      {/* Center: liquid-glass pill menu */}
      <nav className="hidden sm:flex items-center gap-1 liquid-glass rounded-full px-2.5 py-1.5 shadow-2xl">
        {navLinks.map((item) => {
          const isActive = isLinkActive(item.target);
          return (
            <button
              key={item.target}
              onClick={() => handleNavClick(item.target)}
              className={`px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium font-body rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#2c2c2e] text-white font-semibold shadow-md border border-white/25 scale-[1.02]'
                  : 'bg-transparent text-white/75 hover:text-white hover:bg-white/10 border-0'
              }`}
            >
              {item.label}
            </button>
          );
        })}

        {/* White pill button: Check My App */}
        <button
          onClick={() => handleNavClick('studio')}
          className="bg-white text-black font-body font-semibold text-xs md:text-sm px-4 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 whitespace-nowrap hover:bg-white/90 hover:scale-[1.02] transition-all cursor-pointer border-0 shadow-md ml-1"
        >
          <span>Check My App</span>
          <ArrowUpRight size={15} color="currentColor" />
        </button>
      </nav>

      {/* Mobile Bar: Check My App & Hamburger */}
      <div className="sm:hidden flex items-center justify-between w-full">
        <button
          onClick={() => handleNavClick('studio')}
          className="bg-white text-black font-body font-semibold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer border-0 shadow-md"
        >
          <span>Check My App</span>
          <ArrowUpRight size={13} color="currentColor" />
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="liquid-glass w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer border-0 text-white shadow-lg"
          aria-label="Toggle Navigation Menu"
        >
          <span className={`w-4 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`w-4 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-4 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          className="sm:hidden fixed top-16 left-4 right-4 liquid-glass-strong rounded-2xl p-3 flex flex-col gap-1.5 shadow-2xl z-[110] border border-white/15 backdrop-blur-2xl"
        >
          {navLinks.map((item) => {
            const isActive = isLinkActive(item.target);
            return (
              <button
                key={`m-${item.target}`}
                onClick={() => handleNavClick(item.target)}
                className={`text-left px-4 py-2.5 text-sm font-medium font-body rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-[#2c2c2e] text-white font-semibold shadow-inner border border-white/25'
                    : 'liquid-glass text-white/80 hover:text-white border-0'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] font-mono text-white/40">→</span>
              </button>
            );
          })}
          <button
            onClick={() => handleNavClick('studio')}
            className="mt-1 bg-white text-black font-body font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 border-0 cursor-pointer shadow-md"
          >
            <span>Run DuoScope Audit</span>
            <ArrowUpRight size={15} color="currentColor" />
          </button>
        </div>
      )}
    </header>
  );
};
