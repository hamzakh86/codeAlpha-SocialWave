import { getSavedPostsAction } from "../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SavedPost from "../components/post/SavedPost";
import NoSavedPost from "../assets/nopost.jpg";
import CommonLoading from "../components/loader/CommonLoading";

const Saved = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSavedPostsAction());
  }, [dispatch]);

  const savedPosts = useSelector((state) => state.posts?.savedPosts);

  return (
    <div className="main-section">
      <div className="flex flex-col">
        <div className="app-panel mb-5 rounded-lg p-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Your saved posts
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Everything you saved for quick access.
          </p>
        </div>

        {!savedPosts ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <CommonLoading />
          </div>
        ) : savedPosts.length > 0 ? (
          <div className="flex flex-col">
            {[...savedPosts].reverse().map((post) => (
              <SavedPost key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="app-panel flex flex-col items-center justify-center rounded-lg p-8 text-center">
            <p className="pb-5 text-gray-500 dark:text-gray-400">
              You haven't saved any post yet.
            </p>
            <img loading="lazy" src={NoSavedPost} alt="no post" className="w-full max-w-sm rounded-lg object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
