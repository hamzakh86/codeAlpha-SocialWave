import { memo, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getComPostsAction,
  clearCommunityPostsAction,
} from "../../redux/actions/postActions";
import PostForm from "../form/PostForm";
import Post from "../post/Post";
import FollowingUsersPosts from "./FollowingUsersPosts";
import CommonLoading from "../loader/CommonLoading";

const MemoizedPost = memo(Post);

const MainSection = () => {
  const dispatch = useDispatch();

  const communityData = useSelector((state) => state.community?.communityData);
  const communityPosts = useSelector((state) => state.posts?.communityPosts);

  const totalCommunityPosts = useSelector(
    (state) => state.posts?.totalCommunityPosts
  );

  const [activeTab, setActiveTab] = useState("All posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const LIMIT = 10;

  const postError = useSelector((state) => state.posts?.postError);

  useEffect(() => {
    const fetchInitialPosts = async () => {
      if (communityData?._id) {
        dispatch(getComPostsAction(communityData._id, LIMIT, 0)).finally(() => {
          setIsLoading(false);
        });
      }
    };

    fetchInitialPosts();

    return () => {
      dispatch(clearCommunityPostsAction());
    };
  }, [dispatch, communityData]);

  const handleLoadMore = () => {
    if (
      !isLoadMoreLoading &&
      communityPosts.length > 0 &&
      communityPosts.length < totalCommunityPosts
    ) {
      setIsLoadMoreLoading(true);
      dispatch(
        getComPostsAction(communityData._id, LIMIT, communityPosts.length)
      ).finally(() => {
        setIsLoadMoreLoading(false);
      });
    }
  };

  const memoizedCommunityPosts = useMemo(() => {
    return communityPosts?.map((post) => (
      <MemoizedPost key={post._id} post={post} />
    ));
  }, [communityPosts]);

  if (isLoading || !communityData || !communityPosts) {
    return (
      <div className="main-section flex items-center justify-center h-screen">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 sm:p-5">
      <ul className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-900/70">
        <li
          className={`${
            activeTab === "All posts"
              ? "bg-white text-primary-600 shadow-sm dark:bg-gray-800 dark:text-primary-300"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          } flex-1 cursor-pointer rounded-md px-2 py-2 text-center text-sm font-semibold transition-all`}
          onClick={() => setActiveTab("All posts")}
        >
          All post
        </li>
        <li
          className={`${
            activeTab === "You're following"
              ? "bg-white text-primary-600 shadow-sm dark:bg-gray-800 dark:text-primary-300"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          } flex-1 cursor-pointer rounded-md px-2 py-2 text-center text-sm font-semibold transition-all`}
          onClick={() => setActiveTab("You're following")}
        >
          You're following
        </li>
      </ul>
      <div className="mt-4 flex flex-col gap-4">
        {activeTab === "All posts" && (
          <>
            <div className="mb-4">
              <PostForm
                communityId={communityData._id}
                communityName={communityData.name}
              />
            </div>
            {postError && (
              <div className="mx-auto rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                {postError}
              </div>
            )}

            <div>{memoizedCommunityPosts}</div>
            {communityPosts.length < totalCommunityPosts && (
              <button
                className="my-3 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleLoadMore}
                disabled={isLoadMoreLoading}
              >
                {isLoadMoreLoading ? "Loading..." : "Load More Posts"}
              </button>
            )}
          </>
        )}
        {activeTab === "You're following" && (
          <FollowingUsersPosts communityData={communityData} />
        )}
      </div>
    </div>
  );
};

export default MainSection;
