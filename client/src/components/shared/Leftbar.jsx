import { useMemo, useEffect, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineRectangleStack,
  HiOutlineTag,
} from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { GiTeamIdea, GiOasis } from "react-icons/gi";
import { MdOutlineTravelExplore } from "react-icons/md";

const Leftbar = ({ showLeftbar }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.auth?.userData);
  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    dispatch(getJoinedCommunitiesAction());
  }, [dispatch]);

  const visibleCommunities = useMemo(() => {
    return joinedCommunities?.slice(0, 5);
  }, [joinedCommunities]);

  const communityLinks = useMemo(() => {
    return visibleCommunities?.map((community) => ({
      href: `/community/${community.name}`,
      label: community.name,
    }));
  }, [visibleCommunities]);

  const isActivePath = (href) => {
    if (href === "/home") return location.pathname === "/" || location.pathname === "/home";
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const navLinks = [
    { name: "Discover", href: "/home", icon: <HiOutlineHome className="text-2xl" /> },
    { name: "My Profile", href: "/profile", icon: <HiOutlineUserCircle className="text-2xl" /> },
    { name: "Saved Places", href: "/saved", icon: <HiOutlineTag className="text-2xl" /> },
  ];

  if (user && user.role === "general") {
    navLinks.push({ name: "Travelers", href: "/following", icon: <HiOutlineRectangleStack className="text-2xl" /> });
  }

  return (
    <aside className={`${showLeftbar ? "block" : "hidden md:block"} leftbar app-panel h-[calc(100vh-6rem)] overflow-y-auto rounded-lg p-4 md:h-[calc(100vh-7rem)]`}>
      <div className="flex flex-col justify-start items-center h-full">
        <div className="flex flex-col items-start gap-2 w-full">
          {navLinks.map((link) => {
            const isActive = isActivePath(link.href);
            return (
              <Link
                key={link.name}
                className={`flex items-center gap-4 w-full p-3 rounded-lg text-[16px] font-medium transition-all duration-300 group
                  ${isActive 
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50 hover:text-primary-500 dark:hover:text-primary-400"}`}
                to={link.href}
              >
                <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {link.icon}
                </div>
                <p>{link.name}</p>
              </Link>
            )
          })}

          <hr className="w-full my-6 border-gray-100 dark:border-gray-800" />

          {communityLinks && communityLinks.length > 0 ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 font-bold text-gray-900 dark:text-white items-center text-lg uppercase tracking-wider text-sm opacity-80">
                  <HiOutlineUserGroup className="text-xl" />
                  Communities
                </div>

                <Link
                  className="flex relative items-center text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
                  to="/my-communities"
                >
                  See all
                  <span className="absolute -top-3 -right-4 text-[10px] text-white bg-accent-500 shadow-sm shadow-accent-500/50 w-5 h-5 rounded-full flex justify-center items-center">
                    {joinedCommunities.length}
                  </span>
                </Link>
              </div>
              <ul className="w-full space-y-2">
                {communityLinks.map((communityLink) => (
                  <li key={communityLink.href}>
                    <Link
                      className="flex items-center gap-3 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-300 font-medium group"
                      to={communityLink.href}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        <GiOasis className="text-xl" />
                      </div>
                      {communityLink.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="w-full text-center p-4 text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              No communities joined yet.
            </div>
          )}

          {user && user.role === "general" && (
            <div className="w-full mt-6 mt-auto hidden md:block">
              <Link 
                to="/communities" 
                className="flex items-center justify-center gap-2 w-full p-4 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium shadow-lg shadow-primary-500/25 transition-all duration-300 group"
              >
                <MdOutlineTravelExplore className="text-xl group-hover:animate-pulse" />
                <span>Explore Communities</span>
              </Link>
            </div>
          )}
          
          {user && user.role === "general" && (
            <div className="md:hidden w-full mt-4">
              <hr className="w-full mb-4 border-gray-100 dark:border-gray-800" />
              <div className="flex justify-center gap-2 items-center">
                <GiTeamIdea className="text-primary-500 text-xl" />
                <Link to="/communities" className="text-primary-500 font-medium hover:underline">
                  Discover more
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default memo(Leftbar);
