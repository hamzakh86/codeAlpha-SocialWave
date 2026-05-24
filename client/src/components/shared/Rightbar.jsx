import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotJoinedCommunitiesAction } from "../../redux/actions/communityActions";
import {
  getPublicUsersAction,
  followUserAndFetchData,
} from "../../redux/actions/userActions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import JoinModal from "../modals/JoinModal";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoMdPeople } from "react-icons/io";
import { MdOutlineLightbulb } from "react-icons/md";
import placeholder from "../../assets/placeholder.png";

const Rightbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [joinModalVisibility, setJoinModalVisibility] = useState({});
  const [notJoinedCommunitiesFetched, setNotJoinedCommunitiesFetched] =
    useState(false);
  const [publicUsersFetched, setPublicUsersFetched] = useState(false);

  const currentUser = useSelector((state) => state.auth?.userData);
  const recommendedUsers = useSelector((state) => state.user?.publicUsers);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getNotJoinedCommunitiesAction());
      setNotJoinedCommunitiesFetched(true);
      await dispatch(getPublicUsersAction());
    };

    fetchData().then(() => {
      setPublicUsersFetched(true);
    });
  }, [dispatch]);

  const notJoinedCommunities = useSelector(
    (state) => state.community?.notJoinedCommunities
  );

  const [visibleCommunities, remainingCount] = useMemo(() => {
    const visibleCommunities = notJoinedCommunities?.slice(0, 4) || [];
    const remainingCount = Math.max((notJoinedCommunities?.length || 0) - 4, 0);
    return [visibleCommunities, remainingCount];
  }, [notJoinedCommunities]);

  const [followLoading, setFollowLoadingState] = useState({});

  const followUserHandler = useCallback(
    async (toFollowId) => {
      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: true,
      }));

      await dispatch(followUserAndFetchData(toFollowId, currentUser));

      setFollowLoadingState((prevState) => ({
        ...prevState,
        [toFollowId]: false,
      }));

      navigate(`/user/${toFollowId}`);
    },
    [dispatch, currentUser, navigate]
  );

  const toggleJoinModal = useCallback((communityId, visible) => {
    setJoinModalVisibility((prev) => ({
      ...prev,
      [communityId]: visible,
    }));
  }, []);

  const currentLocation = useLocation().pathname;

  return (
    <aside className="rightbar app-panel h-[calc(100vh-7rem)] overflow-y-auto rounded-lg p-4">
      
      {/* Daily engagement prompt */}
      <div className="relative mb-8 overflow-hidden rounded-lg border border-accent-500/20 bg-gradient-to-br from-accent-500/10 to-primary-500/10 p-4 group">
        <div className="flex items-start gap-3 relative z-10">
          <div className="mt-0.5 rounded-lg bg-white p-2 text-accent-500 shadow-sm dark:bg-gray-800">
            <MdOutlineLightbulb className="text-xl" />
          </div>
          <div>
            <h5 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Spark of the Day</h5>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Ask a specific question in a community. Clear prompts start better conversations and faster replies.
            </p>
          </div>
        </div>
      </div>

      {currentLocation !== "/communities" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h5 className="font-bold text-gray-900 dark:text-white uppercase tracking-wide text-sm">Suggested Communities</h5>
            {remainingCount > 0 && (
              <Link
                className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
                to="/communities"
              >
                See all
              </Link>
            )}
          </div>

          {notJoinedCommunitiesFetched && visibleCommunities.length === 0 && (
            <div className="text-center text-sm font-medium p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-500 dark:text-gray-400">
              No communities to join right now. Check back later!
            </div>
          )}
          
          <ul className="flex flex-col gap-3">
            {visibleCommunities?.map((community) => (
              <li
                key={community._id}
              className="group flex items-center justify-between rounded-lg border border-transparent bg-gray-50/80 p-3 transition-all duration-300 hover:border-gray-200 hover:bg-gray-100/80 dark:bg-gray-800/40 dark:hover:border-gray-700 dark:hover:bg-gray-800/80"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={community.banner || placeholder}
                    className="h-10 w-10 rounded-lg object-cover shadow-sm transition-transform group-hover:scale-105"
                    alt="community"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-bold text-[15px] text-gray-900 dark:text-gray-100 truncate">
                      {community.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <IoMdPeople className="text-primary-500" />
                      {community.members.length} members
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoinModal(community._id, true)}
                  className="ml-2 flex-shrink-0 rounded-lg border border-gray-200 bg-white p-2 text-primary-600 shadow-sm transition-all duration-300 hover:border-primary-500 hover:bg-primary-500 hover:text-white dark:border-gray-600 dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white"
                  title="Join"
                >
                  <BsPersonPlusFill className="text-lg" />
                </button>
                <JoinModal
                  show={joinModalVisibility[community._id] || false}
                  onClose={() => toggleJoinModal(community._id, false)}
                  community={community}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h5 className="font-bold text-gray-900 dark:text-white uppercase tracking-wide text-sm mb-5">People to Follow</h5>

        {publicUsersFetched && recommendedUsers?.length === 0 && (
          <div className="text-center text-sm font-medium p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-gray-500 dark:text-gray-400">
            No people to follow. Check back later!
          </div>
        )}
        
        <ul className="flex flex-col gap-3">
          {recommendedUsers?.length > 0 &&
            recommendedUsers.map((user) => (
              <li
                key={user._id}
              className="group flex items-center justify-between rounded-lg border border-transparent bg-gray-50/80 p-3 transition-all duration-300 hover:border-gray-200 hover:bg-gray-100/80 dark:bg-gray-800/40 dark:hover:border-gray-700 dark:hover:bg-gray-800/80"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative">
                    <img
                      className="h-10 w-10 rounded-lg object-cover shadow-sm transition-transform group-hover:scale-105"
                      src={user.avatar}
                      alt={user.name}
                    />
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-800"></div>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <Link
                      to={`/user/${user._id}`}
                      className="font-bold text-[15px] text-gray-900 dark:text-gray-100 truncate hover:text-primary-500 transition-colors"
                    >
                      {user.name}
                    </Link>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                      Followers: {user.followerCount}
                    </div>
                  </div>
                </div>
                
                <button
                  disabled={followLoading[user._id]}
                  onClick={() => followUserHandler(user._id)}
                  className="ml-2 flex-shrink-0 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-bold text-primary-600 shadow-sm transition-all duration-300 hover:bg-primary-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white"
                >
                  {followLoading[user._id] ? (
                    <span className="loader scale-50 m-0"></span>
                  ) : (
                    "Follow"
                  )}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
};

export default Rightbar;
