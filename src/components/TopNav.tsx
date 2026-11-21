import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Globe, LogOut, Menu, User, X } from 'lucide-react';
import { Language, ScreenTab } from '../types';
import { UI_COPY, pick } from '../i18n/translations';
import { MedioraLogo } from './MedioraLogo';

interface TopNavProps {
  activeTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onSelectDepartments: () => void;
  onQuickBook: () => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onSelectDepartments,
  onQuickBook,
  lang,
  onChangeLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [departmentsFocused, setDepartmentsFocused] = useState(false);

  // Interactive account / login quick panel state
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginPhone, setLoginPhone] = useState('1712489210');
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountOpen]);

  const navItems: {
    id: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }[] = [
    {
      id: 'overview',
      label: pick(UI_COPY.nav.overview, lang),
      isActive: activeTab === 'overview' && !departmentsFocused,
      onClick: () => {
        setDepartmentsFocused(false);
        onSelectTab('overview');
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'doctors',
      label: pick(UI_COPY.nav.doctors, lang),
      isActive: activeTab === 'doctors',
      onClick: () => {
        setDepartmentsFocused(false);
        onSelectTab('doctors');
        setMobileMenuOpen(false);
      },
    },
    {
      id: 'departments',
      label: pick(UI_COPY.nav.departments, lang),
      isActive: activeTab === 'overview' && departmentsFocused,
      onClick: () => {
        setDepartmentsFocused(true);
        setMobileMenuOpen(false);
        onSelectDepartments();
      },
    },
    {
      id: 'appointments',
      label: pick(UI_COPY.nav.appointments, lang),
      isActive: activeTab === 'appointments',
      onClick: () => {
        setDepartmentsFocused(false);
        onSelectTab('appointments');
        setMobileMenuOpen(false);
      },
    },
    {
      id: 'records',
      label: pick(UI_COPY.nav.records, lang),
      isActive: activeTab === 'records',
      onClick: () => {
        setDepartmentsFocused(false);
        onSelectTab('records');
        setMobileMenuOpen(false);
      },
    },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignedIn(true);
    setLoginModalOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ease-out border-b ${
          scrolled
            ? 'bg-[#FBF8F2]/96 backdrop-blur-md border-[#E7DFD2] shadow-[0_10px_28px_-12px_rgba(37,51,47,0.12)]'
            : 'bg-[#FBF8F2]/92 backdrop-blur-sm border-[#E7DFD2]/85'
        }`}
      >
        {/* Subtle 2px top warm peach-coral hairline accent for brand polish */}
        <div
          aria-hidden="true"
          className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E8B8A5]/70 to-transparent"
        />

        <div
          className={`max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-6 transition-all duration-200 ease-out ${
            scrolled ? 'h-16' : 'h-[74px]'
          }`}
        >
          {/* LEFT: Signature Mediora Brand Logo */}
          <button
            type="button"
            onClick={() => {
              setDepartmentsFocused(false);
              onSelectTab('overview');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52] rounded-xl py-1 cursor-pointer"
            aria-label="Mediora Home"
          >
            <span className="hidden sm:inline-flex">
              <MedioraLogo variant="desktop" lang={lang} compact={scrolled} />
            </span>
            <span className="inline-flex sm:hidden">
              <MedioraLogo variant="mobile" lang={lang} compact={scrolled} />
            </span>
          </button>

          {/* CENTER: Lively Modern Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`group relative px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B52] cursor-pointer ${
                  item.isActive
                    ? 'text-[#245B52] bg-[#F3D8CC]/40'
                    : 'text-[#59635C] hover:text-[#245B52] hover:bg-[#F3D8CC]/25'
                }`}
              >
                <span>{item.label}</span>
                {/* Animated active/hover underline with subtle peach-coral end dot */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-[#245B52] origin-left transition-transform duration-200 ease-out ${
                    item.isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-75 opacity-60'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* RIGHT: Language Selector · Log In / Account · Book Appointment Primary Pill CTA */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* Compact Bilingual Language Selector */}
            <div
              role="group"
              aria-label="Language Selector"
              className="inline-flex items-center p-0.5 bg-[#F5F0E7] border border-[#E7DFD2] rounded-full"
            >
              <button
                type="button"
                onClick={() => onChangeLang('en')}
                className={`h-8 px-2.5 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#FFFDF8] text-[#245B52] shadow-mediora-1'
                    : 'text-[#747C73] hover:text-[#25332F]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onChangeLang('bn')}
                className={`h-8 px-2.5 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-[#FFFDF8] text-[#245B52] shadow-mediora-1'
                    : 'text-[#747C73] hover:text-[#25332F]'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Log In / Patient Account Button */}
            <div className="relative" ref={accountRef}>
              {isSignedIn ? (
                <button
                  type="button"
                  onClick={() => setAccountOpen((prev) => !prev)}
                  className="h-10 px-3.5 rounded-full text-sm font-semibold text-[#25332F] hover:text-[#245B52] hover:bg-[#F3D8CC]/35 transition-colors duration-150 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-[#F3D8CC] text-[#25332F] text-[11px] font-extrabold inline-flex items-center justify-center">
                    RI
                  </span>
                  <span>{lang === 'bn' ? 'রফিকুল' : 'Rafiqul'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="h-10 px-3.5 rounded-full text-sm font-semibold text-[#25332F] hover:text-[#245B52] hover:bg-[#F3D8CC]/35 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {pick(UI_COPY.nav.login, lang)}
                </button>
              )}

              {/* Account Popover */}
              {accountOpen && isSignedIn && (
                <div className="absolute right-0 mt-2 w-60 bg-[#FFFDF8] rounded-2xl border border-[#E7DFD2] shadow-mediora-2 p-3 space-y-2 z-50">
                  <div className="px-2.5 py-2 border-b border-[#EFE8DC]">
                    <p className="text-sm font-bold text-[#25332F]">
                      {lang === 'bn' ? 'রফিকুল ইসলাম' : 'Rafiqul Islam'}
                    </p>
                    <p className="text-xs text-[#747C73] tabular-nums mt-0.5">
                      {pick(UI_COPY.workspace.patientId, lang)}: BD-DH-48291
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      onSelectTab('appointments');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold text-[#25332F] hover:bg-[#F5F0E7] transition-colors cursor-pointer"
                  >
                    {pick(UI_COPY.nav.appointments, lang)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      onSelectTab('records');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold text-[#25332F] hover:bg-[#F5F0E7] transition-colors cursor-pointer"
                  >
                    {pick(UI_COPY.nav.records, lang)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      setIsSignedIn(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold text-[#747C73] hover:bg-[#F3D8CC]/45 hover:text-[#25332F] inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'সাইন আউট' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Forest Teal Pill CTA with subtle hover movement & peach-coral cue */}
            <button
              type="button"
              onClick={onQuickBook}
              className="group h-10 px-5 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-full transition-all duration-200 ease-out hover:-translate-y-[1px] shadow-mediora-1 hover:shadow-mediora-2 inline-flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F3D8CC] cursor-pointer"
            >
              <span>{pick(UI_COPY.nav.bookCta, lang)}</span>
              <ArrowRight className="w-4 h-4 text-[#E8B8A5] transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* MOBILE / TABLET RIGHT: Compact Uncluttered Menu Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-11 h-11 rounded-full border border-[#E7DFD2] bg-[#FFFDF8] text-[#25332F] hover:border-[#E8B8A5] hover:bg-[#F3D8CC]/30 flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-mediora-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Clean Slide-Down Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E7DFD2] bg-[#FBF8F2] px-4 pt-3 pb-5 shadow-mediora-2">
            <nav aria-label="Mobile Navigation" className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className={`w-full h-12 px-4 rounded-2xl text-left text-[15px] font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    item.isActive
                      ? 'bg-[#F3D8CC]/65 text-[#25332F]'
                      : 'text-[#25332F] hover:bg-[#F5F0E7]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isActive && (
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full bg-[#245B52]"
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#E7DFD2] space-y-3">
              {/* Mobile Language & Account Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#747C73]">
                  <Globe className="w-4 h-4 text-[#245B52]" />
                  <div className="inline-flex items-center p-0.5 bg-[#F5F0E7] border border-[#E7DFD2] rounded-full">
                    <button
                      type="button"
                      onClick={() => onChangeLang('en')}
                      className={`h-8 px-3 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        lang === 'en'
                          ? 'bg-[#FFFDF8] text-[#245B52] shadow-mediora-1'
                          : 'text-[#747C73]'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeLang('bn')}
                      className={`h-8 px-3 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        lang === 'bn'
                          ? 'bg-[#FFFDF8] text-[#245B52] shadow-mediora-1'
                          : 'text-[#747C73]'
                      }`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isSignedIn) {
                      setIsSignedIn(false);
                    } else {
                      setLoginModalOpen(true);
                    }
                  }}
                  className="h-9 px-3.5 rounded-full border border-[#E7DFD2] bg-[#FFFDF8] text-xs font-bold text-[#25332F] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#245B52]" />
                  <span>
                    {isSignedIn
                      ? lang === 'bn'
                        ? 'সাইন আউট'
                        : 'Sign Out'
                      : pick(UI_COPY.nav.login, lang)}
                  </span>
                </button>
              </div>

              {/* Highlighted Full-Width Book Appointment Pill CTA */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onQuickBook();
                }}
                className="w-full h-12 px-5 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-bold rounded-full shadow-mediora-1 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{pick(UI_COPY.nav.bookCta, lang)}</span>
                <ArrowRight className="w-4 h-4 text-[#E8B8A5]" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Lightweight Patient Sign-In Modal */}
      {loginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#25332F]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mediora-login-title"
        >
          <div className="bg-[#FFFDF8] w-full max-w-sm rounded-3xl border border-[#E7DFD2] shadow-mediora-3 overflow-hidden">
            <div className="px-6 py-4 bg-[#FBF8F2] border-b border-[#E7DFD2] flex items-center justify-between">
              <MedioraLogo variant="mobile" lang={lang} />
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                aria-label="Close sign in"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#747C73] hover:bg-[#F3D8CC]/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              <div>
                <h2 id="mediora-login-title" className="text-lg font-extrabold text-[#25332F]">
                  {lang === 'bn' ? 'রোগী পোর্টালে লগ ইন' : 'Sign in to Mediora'}
                </h2>
                <p className="text-xs text-[#747C73] mt-1">
                  {lang === 'bn'
                    ? 'আপনার অ্যাপয়েন্টমেন্ট ও স্বাস্থ্য রেকর্ড দেখতে মোবাইল নম্বর দিন।'
                    : 'Access your appointments, vitals history, and verified prescriptions.'}
                </p>
              </div>

              <div>
                <label
                  htmlFor="login-phone"
                  className="block text-xs font-bold text-[#25332F] mb-1.5"
                >
                  {pick(UI_COPY.booking.mobileNumber, lang)}
                </label>
                <div className="flex items-center h-12 rounded-xl border border-[#E7DFD2] bg-[#FFFDF8] overflow-hidden focus-within:border-[#245B52] focus-within:ring-3 focus-within:ring-[#E6EFE7]">
                  <span className="h-full px-3 bg-[#FBF8F2] border-r border-[#E7DFD2] inline-flex items-center text-xs font-bold text-[#25332F] tabular-nums">
                    +880
                  </span>
                  <input
                    id="login-phone"
                    type="tel"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 h-full px-3 bg-transparent text-sm font-semibold text-[#25332F] focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#245B52] hover:bg-[#1D4B43] text-[#FFFDF8] text-sm font-semibold rounded-full inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#E8B8A5]" />
                <span>{lang === 'bn' ? 'রফিকুল হিসেবে চালিয়ে যান' : 'Continue as Rafiqul Islam'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
