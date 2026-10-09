
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';

import { useHostel } from '../context/HostelContext';

interface NavbarProps {
  isPreloaderLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPreloaderLoading = false,
}) => {
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
  /* STATE                                                                      */
  /* -------------------------------------------------------------------------- */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* REFS                                                                       */
  /* -------------------------------------------------------------------------- */

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const lastScrollY = useRef(0);
  const scrollAccumulator = useRef(0);

  /*
   * Prevents the navbar from immediately appearing because of the scroll
   * position changing while a new page/view is being opened.
   */
  const navTransitionLock = useRef(false);

  /*
   * Used to prevent the first tiny scroll movement from triggering
   * the navbar.
   */
  const hasScrolledAfterTransition = useRef(false);

  const ticking = useRef(false);

  /* -------------------------------------------------------------------------- */
  /* NOTIFICATIONS                                                              */
  /* -------------------------------------------------------------------------- */

  const unreadCount =
    notifications?.filter(
      (notification: any) => !notification.read
    ).length || 0;

  /* -------------------------------------------------------------------------- */
  /* PRELOADER STATE                                                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    /*
     * While the preloader is active, the navbar must not exist visually.
     */
    if (isPreloaderLoading) {
      setIsNavbarVisible(false);

      lastScrollY.current = window.scrollY;
      scrollAccumulator.current = 0;
      navTransitionLock.current = false;
      hasScrolledAfterTransition.current = false;

      return;
    }

    /*
     * The preloader has completed.
     *
     * Keep the navbar hidden after the intro.
     * It will appear when the user starts scrolling.
     */
    setIsNavbarVisible(false);

    lastScrollY.current = window.scrollY;
    scrollAccumulator.current = 0;

    navTransitionLock.current = true;
    hasScrolledAfterTransition.current = false;
  }, [isPreloaderLoading]);

  /* -------------------------------------------------------------------------- */
  /* SCROLL BEHAVIOUR                                                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const previousScrollY = lastScrollY.current;

        const difference = currentScrollY - previousScrollY;

        lastScrollY.current = currentScrollY;

        /*
         * Never show navbar while preloader is active.
         */
        if (isPreloaderLoading) {
          setIsNavbarVisible(false);

          ticking.current = false;
          return;
        }

        /*
         * TOP OF PAGE
         *
         * At the very top the navbar should always be visible.
         */
        if (currentScrollY <= 12) {
          setIsNavbarVisible(true);

          navTransitionLock.current = false;
          hasScrolledAfterTransition.current = false;
          scrollAccumulator.current = 0;

          ticking.current = false;
          return;
        }

        /*
         * AFTER PRELOADER / PAGE TRANSITION
         *
         * Navbar stays hidden until the user actually starts scrolling.
         */
        if (navTransitionLock.current) {
          if (Math.abs(difference) < 6) {
            ticking.current = false;
            return;
          }

          hasScrolledAfterTransition.current = true;

          /*
           * First meaningful scroll:
           *
           * Scrolling UP  -> show navbar immediately.
           * Scrolling DOWN -> keep it hidden.
           */
          if (difference < 0) {
            setIsNavbarVisible(true);
          } else {
            setIsNavbarVisible(false);
          }

          /*
           * The transition lock is now finished.
           * Normal scroll behaviour takes over.
           */
          navTransitionLock.current = false;
          scrollAccumulator.current = 0;

          ticking.current = false;
          return;
        }

        /*
         * Ignore tiny movements.
         * This prevents jitter from trackpads and mobile browsers.
         */
        if (Math.abs(difference) < 2) {
          ticking.current = false;
          return;
        }

        /*
         * Accumulate scroll movement before changing navbar state.
         * This creates a smoother experience than reacting to every
         * single pixel.
         */
        scrollAccumulator.current += difference;

        /*
         * SCROLLING DOWN
         *
         * Hide navbar after enough downward movement.
         */
        if (scrollAccumulator.current > 14) {
          setIsNavbarVisible(false);
          scrollAccumulator.current = 0;
        }

        /*
         * SCROLLING UP
         *
         * Show navbar after enough upward movement.
         */
        if (scrollAccumulator.current < -14) {
          setIsNavbarVisible(true);
          scrollAccumulator.current = 0;
        }

        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPreloaderLoading]);

  /* -------------------------------------------------------------------------- */
  /* BODY SCROLL LOCK                                                           */
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
  /* CLOSE DROPDOWNS WHEN CLICKING OUTSIDE                                      */
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
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* CLOSE MOBILE MENU ON DESKTOP                                               */
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
  /* NAVIGATION                                                                 */
  /* -------------------------------------------------------------------------- */

  const handleNavClick = (viewId: string) => {
    /*
     * Hide navbar immediately.
     */
    setIsNavbarVisible(false);

    /*
     * Prevent the scroll listener from immediately bringing it back.
     */
    navTransitionLock.current = true;
    hasScrolledAfterTransition.current = false;
    scrollAccumulator.current = 0;

    /*
     * Reset scroll tracking.
     */
    lastScrollY.current = window.scrollY;

    /*
     * Close all menus.
     */
    setMobileMenuOpen(false);
    setShowNotifDropdown(false);
    setShowUserDropdown(false);

    /*
     * Change the active page/view.
     */
    setActiveView(viewId as any);

    /*
     * Start the new view at the top.
     */
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* -------------------------------------------------------------------------- */
  /* NAVIGATION LINKS                                                           */
  /* -------------------------------------------------------------------------- */

  const navLinks = [
    {
      id: 'rooms',
      label: 'Rooms',
    },
    {
      id: 'floor-explorer',
      label: 'Floor Explorer',
    },
    {
      id: 'roommates',
      label: 'Roommates',
    },
    {
      id: 'gallery',
      label: 'Gallery',
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          y:
            isPreloaderLoading || !isNavbarVisible
              ? '-110%'
              : '0%',
        }}
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          fixed
          top-0
          left-0
          right-0
          z-40
          w-full
          bg-[#211F1D]
          border-b
          border-[#5B514B]
        "
      >
        {/* ------------------------------------------------------------------ */}
        {/* BOOKING HOLD                                                       */}
        {/* ------------------------------------------------------------------ */}

        {activeBookingHold && (
          <div className="bg-[#FEFB58] text-[#211F1D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-9 flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span>
                  Your room is temporarily reserved while you
                  complete your booking.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MAIN NAV                                                           */}
        {/* ------------------------------------------------------------------ */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[72px] flex items-center justify-between gap-6">
            {/* BRAND */}
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 shrink-0 cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#5B514B]">
                <Image
                  src="/mush_logo.png"
                  alt="Mushia Hostel"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="hidden sm:block text-left">
                <div className="text-sm font-black tracking-tight text-[#F4EFE7]">
                  MUSHIA
                </div>

                <div className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#A1927D]">
                  HOSTEL
                </div>
              </div>
            </button>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = activeView === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className="
                      relative
                      px-4
                      py-2
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#A1927D]
                      hover:text-[#F4EFE7]
                      transition-colors
                      cursor-pointer
                    "
                  >
                    {link.label}

                    {isActive && (
                      <motion.span
                        layoutId="active-nav"
                        className="
                          absolute
                          left-4
                          right-4
                          -bottom-1
                          h-0.5
                          bg-[#FEFB58]
                        "
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2">
              {/* NOTIFICATIONS */}
              <div
                ref={notifMenuRef}
                className="relative hidden sm:block"
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifDropdown((prev) => !prev);
                    setShowUserDropdown(false);
                  }}
                  className="
                    relative
                    w-10
                    h-10
                    rounded-xl
                    border
                    border-[#5B514B]
                    flex
                    items-center
                    justify-center
                    text-[#A1927D]
                    hover:text-[#F4EFE7]
                    hover:border-[#7D6E66]
                    transition-colors
                    cursor-pointer
                  "
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />

                  {unreadCount > 0 && (
                    <span
                      className="
                        absolute
                        top-1
                        right-1
                        min-w-4
                        h-4
                        px-1
                        rounded-full
                        bg-[#FEFB58]
                        text-[#211F1D]
                        text-[8px]
                        font-black
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="
                        absolute
                        right-0
                        top-full
                        mt-3
                        w-80
                        max-w-[calc(100vw-2rem)]
                        rounded-2xl
                        border
                        border-[#5B514B]
                        bg-[#2A2827]
                        shadow-2xl
                        overflow-hidden
                      "
                    >
                      <div className="px-4 py-3 border-b border-[#5B514B]">
                        <div className="text-xs font-black uppercase tracking-wider text-[#F4EFE7]">
                          Notifications
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications?.length ? (
                          notifications.map(
                            (notification: any) => (
                              <div
                                key={notification.id}
                                className="
                                  px-4
                                  py-3
                                  border-b
                                  border-[#5B514B]/60
                                  last:border-0
                                "
                              >
                                <p className="text-xs text-[#F4EFE7]">
                                  {notification.message}
                                </p>

                                {!notification.read && (
                                  <div className="mt-1 text-[9px] uppercase tracking-wider text-[#FEFB58] font-bold">
                                    New
                                  </div>
                                )}
                              </div>
                            )
                          )
                        ) : (
                          <div className="px-4 py-8 text-center text-xs text-[#A1927D]">
                            No notifications yet.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* USER */}
              <div
                ref={userMenuRef}
                className="relative hidden sm:block"
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown((prev) => !prev);
                    setShowNotifDropdown(false);
                  }}
                  className="
                    flex
                    items-center
                    gap-2
                    h-10
                    px-3
                    rounded-xl
                    border
                    border-[#5B514B]
                    text-[#A1927D]
                    hover:text-[#F4EFE7]
                    hover:border-[#7D6E66]
                    transition-colors
                    cursor-pointer
                  "
                >
                  <User className="w-4 h-4" />

                  <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider">
                    {isLoggedIn
                      ? currentStudent?.firstName || 'Account'
                      : 'Account'}
                  </span>

                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      showUserDropdown
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="
                        absolute
                        right-0
                        top-full
                        mt-3
                        w-52
                        rounded-2xl
                        border
                        border-[#5B514B]
                        bg-[#2A2827]
                        shadow-2xl
                        overflow-hidden
                      "
                    >
                      {isLoggedIn ? (
                        <>
                          <div className="px-4 py-4 border-b border-[#5B514B]">
                            <div className="text-xs font-bold text-[#F4EFE7]">
                              {currentStudent?.firstName ||
                                'Welcome'}
                            </div>

                            <div className="text-[10px] text-[#A1927D] mt-1 truncate">
                              {currentStudent?.email || ''}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setShowUserDropdown(false);
                            }}
                            className="
                              w-full
                              px-4
                              py-3
                              flex
                              items-center
                              gap-3
                              text-left
                              text-xs
                              font-bold
                              text-[#A1927D]
                              hover:text-[#F4EFE7]
                              hover:bg-[#5B514B]/30
                              transition-colors
                              cursor-pointer
                            "
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAuthModalOpen(true);
                            setShowUserDropdown(false);
                          }}
                          className="
                            w-full
                            px-4
                            py-4
                            text-left
                            text-xs
                            font-bold
                            text-[#F4EFE7]
                            hover:bg-[#5B514B]/30
                            transition-colors
                            cursor-pointer
                          "
                        >
                          Sign in
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* BOOK */}
              <button
                type="button"
                onClick={() => handleNavClick('booking')}
                className="
                  hidden
                  sm:flex
                  h-10
                  items-center
                  justify-center
                  px-4
                  rounded-xl
                  bg-[#FEFB58]
                  text-[#211F1D]
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  hover:brightness-95
                  transition
                  cursor-pointer
                "
              >
                Book a Room
              </button>

              {/* MOBILE MENU */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="
                  lg:hidden
                  w-10
                  h-10
                  rounded-xl
                  border
                  border-[#5B514B]
                  flex
                  items-center
                  justify-center
                  text-[#F4EFE7]
                  cursor-pointer
                "
                aria-label={
                  mobileMenuOpen
                    ? 'Close menu'
                    : 'Open menu'
                }
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* -------------------------------------------------------------------- */}
      {/* MOBILE DRAWER                                                        */}
      {/* -------------------------------------------------------------------- */}

      <AnimatePresence>
        {mobileMenuOpen && !isPreloaderLoading && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed
                inset-0
                z-30
                bg-black/50
                lg:hidden
              "
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                top-[72px]
                left-0
                right-0
                z-35
                lg:hidden
                bg-[#211F1D]
                border-b
                border-[#5B514B]
                shadow-2xl
              "
            >
              <div className="px-4 py-5 space-y-2">
                {navLinks.map((link) => {
                  const isActive =
                    activeView === link.id;

                  return (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() =>
                        handleNavClick(link.id)
                      }
                      className={`
                        relative
                        w-full
                        px-4
                        py-4
                        rounded-xl
                        flex
                        items-center
                        justify-between
                        text-left
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        transition-colors
                        cursor-pointer
                        ${
                          isActive
                            ? 'bg-[#5B514B]/40 text-[#FEFB58]'
                            : 'text-[#A1927D] hover:text-[#F4EFE7] hover:bg-[#5B514B]/20'
                        }
                      `}
                    >
                      <span>{link.label}</span>

                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FEFB58]" />
                      )}
                    </button>
                  );
                })}

                <div className="pt-3 border-t border-[#5B514B] space-y-2">
                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="
                        w-full
                        h-12
                        rounded-xl
                        border
                        border-[#5B514B]
                        text-[#A1927D]
                        hover:text-[#F4EFE7]
                        hover:bg-[#5B514B]/30
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        flex
                        items-center
                        justify-center
                        gap-2
                        cursor-pointer
                        transition-colors
                      "
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out ({currentStudent?.firstName || 'Account'})
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="
                        w-full
                        h-12
                        rounded-xl
                        border
                        border-[#5B514B]
                        text-[#F4EFE7]
                        hover:bg-[#5B514B]/30
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        flex
                        items-center
                        justify-center
                        gap-2
                        cursor-pointer
                        transition-colors
                      "
                    >
                      <User className="w-4 h-4" />
                      Sign in
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleNavClick('booking')
                    }
                    className="
                      w-full
                      h-12
                      rounded-xl
                      bg-[#FEFB58]
                      text-[#211F1D]
                      text-xs
                      font-black
                      uppercase
                      tracking-wider
                      cursor-pointer
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
    </>
  );
};
