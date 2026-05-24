import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Search from "./Search";
import { memo } from "react";
import { logoutAction } from "../../redux/actions/authActions";
import { IoLogOutOutline, IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { MdOutlineWaves, MdOutlineTravelExplore } from "react-icons/md";
import { Transition } from "@headlessui/react";
import { AiOutlineBars } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

const Navbar = ({ userData, toggleLeftbar, showLeftbar }) => {
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const dropdownRef = useRef(null);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/86 px-3 py-3 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-gray-950/86 md:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 md:gap-6">
      <Link to="/" className="hidden items-center gap-2 md:flex group">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-500 shadow-lg shadow-primary-500/25 transition-all duration-300 group-hover:scale-105">
          <MdOutlineWaves className="text-white text-2xl" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
          Social<span className="text-primary-500">Wave</span>
        </span>
      </Link>

      <button
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-2xl text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden"
        onClick={toggleLeftbar}
        aria-label={showLeftbar ? "Close menu" : "Open menu"}
      >
        {showLeftbar ? <RxCross1 /> : <AiOutlineBars />}
      </button>

      <Link to="/" className="md:hidden">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 shadow-md shadow-primary-500/20">
          <MdOutlineTravelExplore className="text-white text-2xl" />
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <Search />
      </div>

      <div className="relative flex shrink-0 items-center justify-end gap-2 md:w-48 md:gap-4">
        <button
          onClick={toggleTheme}
          className="grid h-10 w-10 place-items-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <IoSunnyOutline className="text-xl" /> : <IoMoonOutline className="text-xl" />}
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg ring-2 ring-transparent transition-all duration-300 hover:ring-primary-500"
          onClick={handleProfileClick}
        >
          <img
            src={userData.avatar}
            alt="profile"
            className="h-10 w-10 rounded-full object-cover"
          />
        </button>
        <Transition
          show={showDropdown}
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 scale-95 translate-y-2"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-150 transform"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-2"
        >
          {() => (
            <div
              ref={dropdownRef}
            className="absolute right-0 top-14 mt-2 w-[min(18rem,calc(100vw-1.5rem))] origin-top-right overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:ring-white/10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div className="p-4" role="none">
                <div className="flex flex-col items-center">
                  <div className="p-1 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 mb-3">
                    <img
                      src={userData.avatar}
                      alt="profile"
                      className="h-16 w-16 rounded-lg object-cover border-4 border-white dark:border-gray-900"
                    />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
                    <Link to={`/profile`}>{userData.name}</Link>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</div>
                </div>
                <div className="my-4 border-t border-gray-100 dark:border-gray-800" />
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors font-medium"
                  role="menuitem"
                  onClick={logout}
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    "Logging out..."
                  ) : (
                    <>
                      <span>Logout</span>
                      <IoLogOutOutline className="text-lg" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </Transition>
      </div>
      </div>
    </nav>
  );
};

export default memo(Navbar);
