import { memo, useMemo, useEffect, useState, useCallback } from "react";
import {
  getPostsAction,
  clearPostsAction,
} from "../../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import Post from "../post/Post";
import CommonLoading from "../loader/CommonLoading";
import { MdOutlineTravelExplore } from "react-icons/md";
import { Link } from "react-router-dom";

const MemoizedPost = memo(Post);

const LoadMoreButton = ({ onClick, isLoading }) => (
  <button
    className="my-4 w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-3 text-sm font-bold text-white shadow-md shadow-primary-500/25 transition-all duration-300 hover:from-primary-600 hover:to-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? "Loading..." : "Load More Experiences"}
  </button>
);

const MainSection = ({ userData }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const posts = useSelector((state) => state.posts?.posts);
  const totalPosts = useSelector((state) => state.posts?.totalPosts);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  const LIMIT = 10;

  useEffect(() => {
    if (userData) {
      dispatch(getPostsAction(LIMIT, 0)).finally(() => {
        setIsLoading(false);
      });
    }

    return () => {
      dispatch(clearPostsAction());
    };
  }, [userData, dispatch, LIMIT]);

  const handleLoadMore = useCallback(() => {
    setIsLoadMoreLoading(true);
    dispatch(getPostsAction(LIMIT, posts.length)).finally(() => {
      setIsLoadMoreLoading(false);
    });
  }, [dispatch, LIMIT, posts.length]);

  const memoizedPosts = useMemo(() => {
    return posts.map((post) => <MemoizedPost key={post._id} post={post} />);
  }, [posts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CommonLoading />
      </div>
    );
  }
  return (
    <div className="pb-10">
      {/* Header card */}
      <div className="app-panel mb-5 rounded-lg p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MdOutlineTravelExplore className="text-primary-500 text-2xl" />
          SocialWave Feed
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fresh posts, communities, and conversations from people you follow.</p>
      </div>

      {/* Posts List */}
      <div>{memoizedPosts}</div>

      {posts.length > 0 && posts.length < totalPosts && (
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoadMoreLoading}
        />
      )}

      {posts.length === 0 && (
        <div className="app-panel flex min-h-[40vh] flex-col items-center justify-center rounded-lg p-8 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-900/20">
            <MdOutlineTravelExplore className="text-4xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your feed is empty</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
            Join communities or follow more people to make your feed active.
          </p>
          <Link
            to="/communities"
            className="rounded-lg bg-primary-500 px-6 py-2.5 font-bold text-white shadow-md shadow-primary-500/20 transition-colors hover:bg-primary-600"
          >
            Explore Communities
          </Link>
        </div>
      )}
    </div>
  );
};

export default MainSection;
