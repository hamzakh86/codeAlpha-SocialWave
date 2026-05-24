import { useState, useEffect } from "react";
import {
  addCommentAction,
  getComPostsAction,
  getOwnPostAction,
  clearCommentFailAction,
} from "../../redux/actions/postActions";
import { useDispatch, useSelector } from "react-redux";
import InappropriatePost from "../modals/InappropriatePostModal";

const CommentForm = ({ communityId, postId }) => {
  const dispatch = useDispatch();
  const [showInappropriateContentModal, setShowInappropriateContentModal] =
    useState(false);

  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComment = {
      content,
      postId,
    };
    try {
      setIsLoading(true);
      const added = await dispatch(addCommentAction(postId, newComment));
      if (!added) return;
      await dispatch(getOwnPostAction(postId));
      setContent("");
      await dispatch(getComPostsAction(communityId));
    } finally {
      setIsLoading(false);
    }
  };

  const isCommentInappropriate = useSelector(
    (state) => state.posts?.isCommentInappropriate
  );

  useEffect(() => {
    if (isCommentInappropriate) {
      setShowInappropriateContentModal(true);
    }
  }, [isCommentInappropriate]);

  return (
    <div>
      <InappropriatePost
        closeInappropriateContentModal={() => {
          setShowInappropriateContentModal(false);
          dispatch(clearCommentFailAction());
        }}
        showInappropriateContentModal={showInappropriateContentModal}
        contentType={"comment"}
      />

      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="my-4">
          <textarea
            className="app-focus min-h-[92px] w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 transition-colors focus:border-primary-500 dark:border-gray-700 dark:bg-gray-950/60 dark:text-gray-100"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            required
            placeholder="Write a comment..."
          />
        </div>
        <div className="flex justify-end">
          <button
            className="app-focus rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading || content.trim().length === 0}
          >
            {isLoading ? "Loading..." : "Comment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
