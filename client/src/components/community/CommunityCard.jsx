import { useState } from "react";
import JoinModal from "../modals/JoinModal";
import placeholder from "../../assets/placeholder.png";
import { MdOutlineGroupAdd, MdExplore } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";

const CommunityCard = ({ community }) => {
  const [joinModalVisibility, setJoinModalVisibility] = useState({});

  const toggleJoinModal = (communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  };
  return (
    <div className="bg-white dark:bg-background-dark/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center group">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="relative flex-shrink-0">
          <img
            className="object-cover rounded-xl w-14 h-14 shadow-sm group-hover:scale-105 transition-transform duration-300"
            src={community.banner || placeholder}
            alt={`${community.name} banner`}
            loading="lazy"
          />
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5">
            <div className="bg-primary-100 dark:bg-primary-900/50 text-primary-500 rounded-full p-1">
              <MdExplore className="text-xs" />
            </div>
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-[16px] font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
            {community.name}
          </h4>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <IoMdPeople className="text-primary-400" />
            {community.members.length} members
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 ml-4">
        <button
          onClick={() => toggleJoinModal(community._id, true)}
          className="flex items-center justify-center w-10 h-10 bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-500 dark:hover:bg-primary-500 rounded-full text-primary-600 dark:text-primary-400 hover:text-white dark:hover:text-white transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary-500/20"
          title="Join Community"
        >
          <MdOutlineGroupAdd className="text-xl" />
        </button>
        <JoinModal
          show={joinModalVisibility[community._id] || false}
          onClose={() => toggleJoinModal(community._id, false)}
          community={community}
        />
      </div>
    </div>
  );
};

export default CommunityCard;
