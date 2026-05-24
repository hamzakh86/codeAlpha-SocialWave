import { Link } from "react-router-dom";
import { CiEdit, CiLocationOn } from "react-icons/ci";
import { GrContactInfo } from "react-icons/gr";
import { MdOutlineTravelExplore, MdFlightTakeoff, MdOutlineSecurity } from "react-icons/md";
import { useState } from "react";
import ProfileUpdateModal from "../modals/ProfileUpdateModal";
import Tooltip from "../shared/Tooltip";

const OwnProfileCard = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-background-dark/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Profile cover */}
      <div
        className="h-32 bg-gradient-to-r from-primary-600 to-accent-500 relative bg-cover bg-center transition-all duration-300"
        style={user.cover ? { backgroundImage: `url(${user.cover})` } : {}}
      >
        <div className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm cursor-pointer transition-colors" onClick={handleOpenModal}>
          <Tooltip text="Edit Passport">
            <CiEdit className="text-white text-xl" />
          </Tooltip>
        </div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
      </div>

      <div className="px-6 pb-6 relative">
        <div className="flex flex-col items-center -mt-16">
          <div className="relative">
            <img
              className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-xl"
              src={user.avatar}
              alt="Profile"
            />
            <div className="absolute bottom-1 right-1 bg-green-500 p-1.5 rounded-full border-2 border-white dark:border-gray-900">
              <MdFlightTakeoff className="text-white text-xs" />
            </div>
          </div>

          <ProfileUpdateModal
            user={user}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />

          <h2 className="mt-4 text-center text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
            {user.name}
          </h2>
          
          <div className="mt-2 flex flex-col items-center gap-2">
            {user.bio ? (
              <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-4 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                <GrContactInfo className="text-primary-500" />
                {user.bio}
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 italic">
                <GrContactInfo className="text-gray-400" />
                No bio added
              </p>
            )}

            {user.location ? (
              <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CiLocationOn className="text-accent-500 text-lg font-bold" />
                {user.location}
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                <CiLocationOn className="text-lg font-bold" />
                Location unknown
              </p>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-100 dark:border-gray-800" />

        <div className="mb-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MdOutlineTravelExplore className="text-primary-500 text-lg" />
            Travel Interests
          </h3>
          {user.interests ? (
            <div className="flex flex-wrap gap-2">
              {user.interests.split(",").map((interest, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/30 hover:scale-105 transition-transform cursor-default shadow-sm"
                >
                  #{interest.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              No interests have been set yet. Add some to find better community matches.
            </p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Link
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors shadow-sm"
            to="/devices-locations"
          >
            <MdOutlineSecurity className="text-lg text-primary-500" />
            Manage Devices & Security
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnProfileCard;
