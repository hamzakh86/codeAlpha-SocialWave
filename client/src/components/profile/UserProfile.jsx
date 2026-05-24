import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAction } from "../../redux/actions/userActions";
import PostOnProfile from "../post/PostOnProfile";
import OwnProfileCard from "./OwnProfileCard";
import CommonLoading from "../loader/CommonLoading";
import OwnInfoCard from "./OwnInfoCard";
import NoPost from "../../assets/nopost.jpg";

const UserProfile = ({ userData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const posts = user?.posts;

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      await dispatch(getUserAction(userData._id));
    };
    fetchUser().then(() => setLoading(false));
  }, [dispatch, userData._id]);

  const MemoizedPostOnProfile = memo(PostOnProfile);

  let postToShow;

  postToShow = posts?.map((post) => (
    <MemoizedPostOnProfile key={post._id} post={post} />
  ));

  return (
    <>
      {loading || !user || !posts ? (
        <div className="flex justify-center items-center h-screen">
          <CommonLoading />
        </div>
      ) : (
        <>
          <OwnProfileCard user={user} />
          <OwnInfoCard user={user} />

          <div className="app-panel mb-4 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Your recent posts
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review what you have shared with your communities.
            </p>
          </div>

          {postToShow?.length === 0 ? (
            <div className="app-panel flex flex-col items-center justify-center rounded-lg p-8 text-center">
              <p className="pb-5 font-semibold text-gray-500 dark:text-gray-400">
                You haven't posted anything yet
              </p>
              <img
                className="w-full max-w-sm rounded-lg object-cover"
                src={NoPost}
                alt="no post"
              />
            </div>
          ) : (
            postToShow
          )}
        </>
      )}
    </>
  );
};

export default UserProfile;
