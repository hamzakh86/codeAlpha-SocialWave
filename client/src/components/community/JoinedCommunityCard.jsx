import { Link } from "react-router-dom";
import { IoMdPeople } from "react-icons/io";
import placeholder from "../../assets/placeholder.png";

const JoinedCommunityCard = ({ community }) => {
  return (
    <Link 
      to={`/community/${community.name}`} 
      className="flex flex-col mb-6 bg-white dark:bg-background-dark/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      <div className="w-full h-32 overflow-hidden relative">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={community.banner || placeholder} 
          alt={community.name} 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-bold text-white truncate shadow-sm mb-1">{community.name}</h3>
          <p className="text-sm font-medium text-gray-200 flex items-center gap-1.5">
            <IoMdPeople className="text-primary-300" />
            {community.members.length} members
          </p>
        </div>
      </div>
    </Link>
  );
};

export default JoinedCommunityCard;
