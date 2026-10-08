'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Users,
} from 'lucide-react';

import { useHostel } from '../context/HostelContext';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    notifications,
    currentStudent,
    isLoggedIn,
    logout,
    activeBookingHold,
    setIsAuthModalOpen,
  } = useHostel();

  /* -------------------------------------------------------------------------- */
  /*                                    STATE                                   */
  /* -------------------------------------------------------------------------- */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Controls hide/show behavior while scrolling.
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Last known scroll position.
  const lastScrollY = useRef(0);

  // Prevents tiny scroll movements from constantly toggling the navbar.
  const scrollAccumulator = useRef(0);

  const unreadCount =
    notifications?.filter((notification: any) => !notification.read).length ||
    0;

  /* -------------------------------------------------------------------------- */
  /*                         HIDE / SHOW ON SCROLL                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Always show navbar when we're at the very top.
        if (currentScrollY <= 12) {
          setIsNavbarVisible(true);
          lastScrollY.current = currentScrollY;
          scrollAccumulator.current = 0;
          ticking = false;
          return;
        }

        const difference = currentScrollY - lastScrollY.current;

        /*
         * Ignore tiny movements.
         * This prevents the navbar from flickering while the user
         * makes small touchpad / mobile scrolling movements.
         */
        if (Math.abs(difference) < 6) {
          ticking = false;
          return;
        }

        scrollAccumulator.current += difference;

        /*
         * Scrolling DOWN
         */
        if (scrollAccumulator.current > 14) {
          setIsNavbarVisible(false);
          scrollAccumulator.current = 0;
        }

        /*
         * Scrolling UP
         */
        if (scrollAccumulator.current < -14) {
          setIsNavbarVisible(true);
          scrollAccumulator.current = 0;
        }

        lastScrollY.current = currentScrollY;
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                           LOCK BODY SCROLL                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /* -------------------------------------------------------------------------- */
  /*                          CLOSE DROPDOWNS                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setShowUserDropdown(false);
      }

      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(target)
      ) {
        setShowNotifDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                      CLOSE MOBILE MENU ON DESKTOP                          */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                              NAVIGATION                                    */
  /* -------------------------------------------------------------------------- */

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setShowNotifDropdown(false);
    setShowUserDropdown(false);
  };

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId as any);
    closeAllMenus();

    // Always return to the top when changing views.
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLogout = () => {
    closeAllMenus();
    logout();
  };

  /* -------------------------------------------------------------------------- */
  /*                              NAV LINKS                                     */
  /* -------------------------------------------------------------------------- */

  const navLinks = [
    {
      id: 'rooms',
      label: 'Rooms',
      icon: Building2,
    },
    {
      id: 'floor-explorer',
      label: 'Floor Explorer',
      icon: Building2,
    },
    {
      id: 'roommates',
      label: 'Roommates',
      icon: Users,
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: Building2,
    },
  ];

  /* -------------------------------------------------------------------------- */
  /*                                 RENDER                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      {/* ---------------------------------------------------------------------- */}
      {/*                          FIXED NAVBAR                                  */}
      {/* ---------------------------------------------------------------------- */}

      <motion.div
        initial={{ y: 0 }}
        animate={{
          y: isNavbarVisible ? '0%' : '-110%',
        }}
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed
          inset-x-0
          top-0
          z-[100]
          w-full
          max-w-full
        "
      >
        {/* ------------------------------------------------------------------ */}
        {/*                         BOOKING HOLD                                */}
        {/* ------------------------------------------------------------------ */}

        <AnimatePresence initial={false}>
          {activeBookingHold && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: 'auto',
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                overflow-hidden
                border-b
                border-[#FEFB58]/20
                bg-[#FEFB58]
                text-[#211F1D]
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  min-h-[40px]
                  w-full
                  max-w-7xl
                  items-center
                  justify-center
                  px-3
                  py-2
                  text-center
                  sm:px-6
                  lg:px-8
                "
              >
                <p className="text-xs font-semibold leading-relaxed sm:text-sm">
                  Your room is temporarily reserved.
                  <span className="ml-1 font-bold">
                    Complete your booking before the hold expires.
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------------ */}
        {/*                             HEADER                                  */}
        {/* ------------------------------------------------------------------ */}

        <header
          className="
            relative
            z-[100]
            w-full
            max-w-full
            border-b
            border-[#5B514B]/35
            bg-[#211F1D]
            text-[#F4EFE7]
            shadow-[0_4px_20px_rgba(0,0,0,0.12)]
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-full
              max-w-7xl
              min-w-0
              items-center
              gap-2
              px-3
              sm:h-[72px]
              sm:px-6
              lg:px-8
            "
          >
            {/* -------------------------------------------------------------- */}
            {/*                              LOGO                              */}
            {/* -------------------------------------------------------------- */}

            <button
              type="button"
              onClick={() => handleNavClick('home')}
              aria-label="Go to homepage"
              className="
                group
                flex
                min-w-0
                shrink-0
                items-center
                rounded-xl
                outline-none
                focus-visible:ring-2
                focus-visible:ring-[#FEFB58]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#211F1D]
              "
            >
              <div
                className="
                  relative
                  h-10
                  w-10
                  shrink-0
                  overflow-hidden
                  rounded-lg
                  sm:h-11
                  sm:w-11
                "
              >
                <Image
                  src="/Mush_logo.png"
                  alt="Mushia Hostel"
                  fill
                  priority
                  sizes="44px"
                  className="
                    object-contain
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />
              </div>
            </button>

            {/* -------------------------------------------------------------- */}
            {/*                         DESKTOP NAV                             */}
            {/* -------------------------------------------------------------- */}

            <nav
              aria-label="Main navigation"
              className="
                ml-auto
                hidden
                min-w-0
                items-center
                gap-1
                lg:flex
              "
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeView === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className={`
                      group
                      relative
                      flex
                      min-h-10
                      shrink-0
                      items-center
                      gap-2
                      rounded-lg
                      px-3
                      text-sm
                      font-medium
                      transition-colors
                      duration-200
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#FEFB58]
                      ${
                        isActive
                          ? 'text-[#FEFB58]'
                          : 'text-[#F4EFE7]/75 hover:text-[#F4EFE7]'
                      }
                    `}
                  >
                    <Icon
                      className={`
                        h-4
                        w-4
                        transition-transform
                        duration-200
                        group-hover:-translate-y-0.5
                        ${
                          isActive
                            ? 'text-[#FEFB58]'
                            : 'text-[#A1927D]'
                        }
                      `}
                    />

                    <span className="whitespace-nowrap">
                      {link.label}
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="navbar-active"
                        className="
                          absolute
                          inset-x-3
                          -bottom-[1px]
                          h-[2px]
                          rounded-full
                          bg-[#FEFB58]
                        "
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* -------------------------------------------------------------- */}
            {/*                          ACTIONS                                */}
            {/* -------------------------------------------------------------- */}

            <div
              className="
                ml-auto
                flex
                shrink-0
                items-center
                gap-1.5
                sm:gap-2
                lg:ml-4
              "
            >
              {/* ---------------------------------------------------------- */}
              {/*                       NOTIFICATIONS                          */}
              {/* ---------------------------------------------------------- */}

              {isLoggedIn && (
                <div
                  ref={notifMenuRef}
                  className="relative hidden sm:block"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifDropdown((value) => !value);
                      setShowUserDropdown(false);
                    }}
                    aria-label="Notifications"
                    aria-expanded={showNotifDropdown}
                    className="
                      relative
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#F4EFE7]/10
                      bg-[#F4EFE7]/[0.04]
                      text-[#F4EFE7]/80
                      transition-all
                      duration-200
                      hover:border-[#F4EFE7]/20
                      hover:bg-[#F4EFE7]/[0.08]
                      hover:text-[#F4EFE7]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#FEFB58]
                    "
                  >
                    <Bell className="h-[18px] w-[18px]" />

                    {unreadCount > 0 && (
                      <span
                        className="
                          absolute
                          right-1
                          top-1
                          flex
                          h-4
                          min-w-4
                          items-center
                          justify-center
                          rounded-full
                          bg-[#FEFB58]
                          px-1
                          text-[9px]
                          font-black
                          leading-none
                          text-[#211F1D]
                        "
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  <AnimatePresence>
                    {showNotifDropdown && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -6,
                          scale: 0.98,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -6,
                          scale: 0.98,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                        className="
                          absolute
                          right-0
                          top-[calc(100%+10px)]
                          z-[120]
                          w-[min(360px,calc(100vw-24px))]
                          overflow-hidden
                          rounded-2xl
                          border
                          border-[#5B514B]/40
                          bg-[#211F1D]
                          shadow-[0_18px_50px_rgba(0,0,0,0.28)]
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-[#5B514B]/30
                            px-4
                            py-3
                          "
                        >
                          <div>
                            <p className="text-sm font-bold text-[#F4EFE7]">
                              Notifications
                            </p>

                            <p className="mt-0.5 text-xs text-[#A1927D]">
                              Your latest updates
                            </p>
                          </div>

                          {unreadCount > 0 && (
                            <span
                              className="
                                rounded-full
                                bg-[#FEFB58]/10
                                px-2
                                py-1
                                text-[10px]
                                font-bold
                                text-[#FEFB58]
                              "
                            >
                              {unreadCount} new
                            </span>
                          )}
                        </div>

                        <div className="max-h-[320px] overflow-y-auto">
                          {notifications?.length ? (
                            notifications.map((notification: any) => (
                              <div
                                key={notification.id}
                                className="
                                  border-b
                                  border-[#5B514B]/20
                                  px-4
                                  py-3.5
                                  last:border-b-0
                                  hover:bg-[#F4EFE7]/[0.03]
                                "
                              >
                                <div className="flex gap-3">
                                  <div
                                    className="
                                      mt-0.5
                                      h-2
                                      w-2
                                      shrink-0
                                      rounded-full
                                      bg-[#FEFB58]
                                    "
                                  />

                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#F4EFE7]">
                                      {notification.title ||
                                        'Notification'}
                                    </p>

                                    {notification.message && (
                                      <p className="mt-1 text-xs leading-relaxed text-[#A1927D]">
                                        {notification.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-5 py-8 text-center">
                              <Bell className="mx-auto h-6 w-6 text-[#A1927D]" />

                              <p className="mt-3 text-sm font-medium text-[#F4EFE7]">
                                No notifications
                              </p>

                              <p className="mt-1 text-xs text-[#A1927D]">
                                You&apos;re all caught up.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/*                         USER MENU                            */}
              {/* ---------------------------------------------------------- */}

              {isLoggedIn ? (
                <div
                  ref={userMenuRef}
                  className="relative hidden lg:block"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown((value) => !value);
                      setShowNotifDropdown(false);
                    }}
                    aria-expanded={showUserDropdown}
                    className="
                      flex
                      min-h-10
                      max-w-[180px]
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-[#F4EFE7]/10
                      bg-[#F4EFE7]/[0.04]
                      px-2.5
                      text-left
                      transition-all
                      duration-200
                      hover:border-[#F4EFE7]/20
                      hover:bg-[#F4EFE7]/[0.08]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#FEFB58]
                    "
                  >
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FEFB58]
                        text-[#211F1D]
                      "
                    >
                      <User className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#F4EFE7]">
                        {currentStudent?.name || 'Student'}
                      </p>

                      <p className="truncate text-[10px] text-[#A1927D]">
                        Account
                      </p>
                    </div>

                    <ChevronDown
                      className={`
                        ml-auto
                        h-3.5
                        w-3.5
                        shrink-0
                        text-[#A1927D]
                        transition-transform
                        duration-200
                        ${
                          showUserDropdown
                            ? 'rotate-180'
                            : ''
                        }
                      `}
                    />
                  </button>

                  {/* User dropdown */}
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -6,
                          scale: 0.98,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          y: -6,
                          scale: 0.98,
                        }}
                        transition={{
                          duration: 0.18,
                        }}
                        className="
                          absolute
                          right-0
                          top-[calc(100%+10px)]
                          z-[120]
                          w-60
                          overflow-hidden
                          rounded-2xl
                          border
                          border-[#5B514B]/40
                          bg-[#211F1D]
                          p-1.5
                          shadow-[0_18px_50px_rgba(0,0,0,0.28)]
                        "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleNavClick('dashboard')
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-left
                            text-sm
                            font-medium
                            text-[#F4EFE7]
                            transition-colors
                            hover:bg-[#F4EFE7]/[0.05]
                          "
                        >
                          <User className="h-4 w-4 text-[#A1927D]" />
                          Dashboard
                        </button>

                        <div className="my-1 h-px bg-[#5B514B]/30" />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-left
                            text-sm
                            font-medium
                            text-[#F4EFE7]
                            transition-colors
                            hover:bg-[#FEFB58]/[0.06]
                            hover:text-[#FEFB58]
                          "
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ---------------------------------------------------------- */
                /*                       DESKTOP LOGIN                        */
                /* ---------------------------------------------------------- */

                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="
                    hidden
                    min-h-10
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-[#F4EFE7]/10
                    bg-[#F4EFE7]/[0.04]
                    px-3
                    text-sm
                    font-semibold
                    text-[#F4EFE7]
                    transition-all
                    duration-200
                    hover:border-[#FEFB58]/30
                    hover:bg-[#FEFB58]/[0.06]
                    hover:text-[#FEFB58]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#FEFB58]
                    lg:flex
                  "
                >
                  <User className="h-4 w-4" />
                  Sign In
                </button>
              )}

              {/* ---------------------------------------------------------- */}
              {/*                       BOOK A ROOM                           */}
              {/* ---------------------------------------------------------- */}

              <button
                type="button"
                onClick={() => handleNavClick('rooms')}
                className="
                  hidden
                  min-h-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#FEFB58]
                  px-4
                  text-sm
                  font-bold
                  text-[#211F1D]
                  transition-all
                  duration-200
                  hover:bg-[#FFFCA0]
                  hover:shadow-[0_6px_20px_rgba(254,251,88,0.14)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#FEFB58]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#211F1D]
                  sm:flex
                "
              >
                Book a Room
              </button>

              {/* ---------------------------------------------------------- */}
              {/*                       MOBILE MENU                           */}
              {/* ---------------------------------------------------------- */}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen((value) => !value);
                  setShowNotifDropdown(false);
                  setShowUserDropdown(false);
                }}
                aria-label={
                  mobileMenuOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
                }
                aria-expanded={mobileMenuOpen}
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#F4EFE7]/10
                  bg-[#F4EFE7]/[0.04]
                  text-[#F4EFE7]
                  transition-all
                  duration-200
                  hover:bg-[#F4EFE7]/[0.08]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#FEFB58]
                  lg:hidden
                "
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{
                        opacity: 0,
                        rotate: -45,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        rotate: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        rotate: 45,
                        scale: 0.8,
                      }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{
                        opacity: 0,
                        rotate: 45,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        rotate: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        rotate: -45,
                        scale: 0.8,
                      }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/*                         MOBILE MENU                                 */}
        {/* ------------------------------------------------------------------ */}

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.button
                type="button"
                aria-label="Close menu"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                onClick={() => setMobileMenuOpen(false)}
                className="
                  fixed
                  inset-0
                  top-16
                  z-[-1]
                  bg-black/35
                  lg:hidden
                "
              />

              {/* Drawer */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: -12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                transition={{
                  duration: 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  left-0
                  right-0
                  top-full
                  z-[110]
                  max-h-[calc(100vh-64px)]
                  overflow-y-auto
                  border-b
                  border-[#5B514B]/40
                  bg-[#211F1D]
                  shadow-[0_18px_50px_rgba(0,0,0,0.25)]
                  lg:hidden
                "
              >
                <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
                  {/* Mobile account */}
                  {isLoggedIn && (
                    <div
                      className="
                        mb-5
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-[#5B514B]/30
                        bg-[#F4EFE7]/[0.035]
                        p-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#FEFB58]
                          text-[#211F1D]
                        "
                      >
                        <User className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#F4EFE7]">
                          {currentStudent?.name || 'Student'}
                        </p>

                        <p className="mt-0.5 text-xs text-[#A1927D]">
                          Student account
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav
                    aria-label="Mobile navigation"
                    className="space-y-1"
                  >
                    {navLinks.map((link, index) => {
                      const Icon = link.icon;
                      const isActive = activeView === link.id;

                      return (
                        <motion.button
                          key={link.id}
                          type="button"
                          initial={{
                            opacity: 0,
                            x: -10,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay: index * 0.035,
                            duration: 0.2,
                          }}
                          onClick={() =>
                            handleNavClick(link.id)
                          }
                          className={`
                            flex
                            min-h-12
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            text-left
                            transition-all
                            duration-200
                            ${
                              isActive
                                ? 'bg-[#FEFB58]/10 text-[#FEFB58]'
                                : 'text-[#F4EFE7] hover:bg-[#F4EFE7]/[0.04]'
                            }
                          `}
                        >
                          <div
                            className={`
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              ${
                                isActive
                                  ? 'bg-[#FEFB58] text-[#211F1D]'
                                  : 'bg-[#F4EFE7]/[0.05] text-[#A1927D]'
                              }
                            `}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <span className="text-sm font-semibold">
                            {link.label}
                          </span>

                          {isActive && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FEFB58]" />
                          )}
                        </motion.button>
                      );
                    })}
                  </nav>

                  {/* Mobile actions */}
                  <div className="mt-5 border-t border-[#5B514B]/30 pt-5">
                    {!isLoggedIn ? (
                      <button
                        type="button"
                        onClick={() => {
                          closeAllMenus();
                          setIsAuthModalOpen(true);
                        }}
                        className="
                          flex
                          min-h-12
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-[#5B514B]/40
                          bg-[#F4EFE7]/[0.04]
                          text-sm
                          font-bold
                          text-[#F4EFE7]
                          transition-colors
                          hover:bg-[#F4EFE7]/[0.08]
                        "
                      >
                        <User className="h-4 w-4" />
                        Sign In
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleNavClick('dashboard')
                          }
                          className="
                            flex
                            min-h-12
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[#5B514B]/40
                            bg-[#F4EFE7]/[0.04]
                            text-sm
                            font-semibold
                            text-[#F4EFE7]
                            transition-colors
                            hover:bg-[#F4EFE7]/[0.08]
                          "
                        >
                          <User className="h-4 w-4" />
                          Dashboard
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="
                            flex
                            min-h-12
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[#5B514B]/40
                            bg-[#F4EFE7]/[0.04]
                            text-sm
                            font-semibold
                            text-[#F4EFE7]
                            transition-colors
                            hover:bg-[#FEFB58]/[0.06]
                            hover:text-[#FEFB58]
                          "
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleNavClick('rooms')}
                      className="
                        mt-2
                        flex
                        min-h-12
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#FEFB58]
                        text-sm
                        font-black
                        text-[#211F1D]
                        transition-all
                        duration-200
                        hover:bg-[#FFFCA0]
                      "
                    >
                      Book a Room
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};