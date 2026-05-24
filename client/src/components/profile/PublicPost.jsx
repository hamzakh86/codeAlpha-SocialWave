import { useEffect, useState } from "react";
import Post from "../post/Post";
import { useSelector, useDispatch } from "react-redux";
import { getPublicPostsAction } from "../../redux/actions/postActions";
import CommonLoading from "../loader/CommonLoading";

const PublicPost = ({ publicUserId }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const publicPosts = useSelector((state) => state.posts?.publicPosts);

  useEffect(() => {
    const getPublicPosts = async () => {
      setLoading(true);
      await dispatch(getPublicPostsAction(publicUserId));
      setLoading(false);
    };
    getPublicPosts();
  }, [dispatch, publicUserId]);

  if (loading) {
    return (
      <div className="flex mt-5 justify-center items-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <section className="my-5">
      <div className="app-panel mb-4 rounded-lg p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Posts</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Recent posts visible from this profile.
        </p>
      </div>
      {publicPosts?.length === 0 ? (
        <p className="app-panel rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
          User has not posted anything yet. Check back later!
        </p>
      ) : (
        <div>
          {publicPosts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PublicPost;
