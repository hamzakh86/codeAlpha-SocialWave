import { memo } from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineDateRange } from "react-icons/md";

const PublicProfileCard = ({ user }) => {
  const followingSince = new Date(user.followingSince).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      to={`/user/${user._id}`}
      className="app-panel app-panel-hover block w-full cursor-pointer rounded-lg p-4 group"
    >
      <div className="flex gap-4 items-center">
        <div className="relative">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-14 h-14 rounded-lg object-cover border-2 border-transparent group-hover:border-primary-500 transition-colors"
            loading="lazy"
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 dark:text-white text-[17px] truncate group-hover:text-primary-500 transition-colors">{user.name}</h2>
          <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            <CiLocationOn className="text-primary-500 text-base" />
            {user.location || "Location unknown"}
          </p>
        </div>
      </div>

      <hr className="my-3 border-gray-50 dark:border-gray-800" />

      <div className="flex justify-between items-center text-xs">
        <p className="font-semibold text-gray-400 flex items-center gap-1">
          <MdOutlineDateRange className="text-sm" /> Following Since
        </p>
        <p className="font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">{followingSince}</p>
      </div>
    </Link>
  );
};

export default memo(PublicProfileCard);
