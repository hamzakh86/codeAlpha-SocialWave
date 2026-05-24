import { useState } from "react";
import { Link } from "react-router-dom";

const CommentSidebar = ({ comments }) => {
  const currentPage = 1;
  const [commentsPerPage, setCommentsPerPage] = useState(10);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const handleLoadMore = () => {
    setCommentsPerPage(commentsPerPage + 10);
  };

  return (
    <aside className="app-panel col-span-1 mx-3 mt-0 max-h-[70vh] overflow-y-auto rounded-lg p-4 md:sticky md:top-24 md:mx-0 md:mt-6 md:h-[calc(100vh-7rem)] md:max-h-none">
      {currentComments.length > 0 && (
        <div>
          <h2 className="mb-4 border-b border-gray-100 pb-3 text-sm font-bold uppercase tracking-wide text-gray-900 dark:border-gray-800 dark:text-white">
            Recent Comments
          </h2>
          {currentComments.map((comment) => (
            <div
              key={comment._id}
              className="flex w-full flex-col border-b border-gray-100 py-3 dark:border-gray-800"
            >
              <div className="flex gap-2">
                <img
                  src={comment.user.avatar}
                  alt="User Avatar"
                  className="h-9 w-9 rounded-lg object-cover"
                />

                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-gray-900 hover:text-primary-500 dark:text-white">
                    <Link to={`/user/${comment.user._id}`}>
                      {comment.user.name}
                    </Link>
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comment.createdAt}
                  </p>
                </div>
              </div>
              <p className="mt-2 whitespace-normal break-words text-sm text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          ))}

          {currentComments.length < comments.length && (
            <button
              className="app-focus mt-3 w-full rounded-lg bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>
      )}

      {currentComments.length === 0 && (
        <div className="flex h-full min-h-[12rem] flex-col items-center justify-center">
          <p className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">No comments yet</p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Be the first to start the discussion.</p>
        </div>
      )}
    </aside>
  );
};

export default CommentSidebar;
