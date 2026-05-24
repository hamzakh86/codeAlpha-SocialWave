import { useEffect } from "react";
import { getNotJoinedCommunitiesAction } from "../redux/actions/communityActions";
import { useDispatch, useSelector } from "react-redux";
import CommonLoading from "../components/loader/CommonLoading";
import CommunityCard from "../components/community/CommunityCard";
import { MdOutlineTravelExplore } from "react-icons/md";

const AllCommunities = () => {
  const dispatch = useDispatch();

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  useEffect(() => {
    dispatch(getNotJoinedCommunitiesAction());
  }, [dispatch]);

  if (!notJoinedCommunities) {
    return (
      <div className="main-section flex items-center justify-center min-h-[50vh]">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="main-section pb-10">
      {/* Header Info */}
      <div className="mb-6 bg-white dark:bg-background-dark/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MdOutlineTravelExplore className="text-primary-500 text-2xl" />
          Explore Communities
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Join active spaces, discover useful posts, and meet people around shared interests.
        </p>
      </div>

      {notJoinedCommunities.length === 0 ? (
        <div className="text-center bg-white dark:bg-background-dark/80 backdrop-blur-md p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center min-h-[30vh]">
          <span className="text-4xl mb-3">🎉</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">You've joined every community!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Check your feed or Leftbar to view publications from all the communities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {notJoinedCommunities?.map((community) => (
            <CommunityCard key={community._id} community={community} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCommunities;
