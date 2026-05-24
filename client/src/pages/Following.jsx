import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFollowingUsersAction } from "../redux/actions/userActions";
import PublicProfileCard from "../components/profile/PublicProfileCard";
import CommonLoading from "../components/loader/CommonLoading";
import noFollow from "../assets/nofollow.jpg";

const Following = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const followingUsers = useSelector((state) => state.user?.followingUsers);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      setLoading(true);
      await dispatch(getFollowingUsersAction());
      setLoading(false);
    };

    fetchFollowingUsers();
  }, [dispatch]);

  return (
    <div className="main-section">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <CommonLoading />
        </div>
      ) : (
        <div>
          <div className="app-panel mb-5 rounded-lg p-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              People you're following
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Keep up with profiles that matter to your feed.
            </p>
          </div>
          {followingUsers?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {followingUsers.map((user) => (
                <PublicProfileCard key={user._id} user={user} />
              ))}
            </div>
          ) : (
           <div className="app-panel flex flex-col items-center justify-center rounded-lg p-8 text-center">
            <p className="pb-5 text-gray-500 dark:text-gray-400">
             You are not following anyone yet.
            </p>
              <img src={noFollow} alt="no follow" className="w-full max-w-sm rounded-lg object-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Following;
