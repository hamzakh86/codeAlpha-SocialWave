import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPostAction,
  clearCreatePostFail,
} from "../../redux/actions/postActions";
import InappropriatePostModal from "../modals/InappropriatePostModal";
import TopicConflictModal from "../modals/TopicConflictModal";
import EligibilityDetectionFailModal from "../modals/EligibilityDetectionFailModal";
import { HiOutlinePhotograph, HiOutlineX } from "react-icons/hi";

const PostForm = ({ communityId, communityName }) => {
  const dispatch = useDispatch();
  const [showInappropriateContentModal, setShowInappropriateContentModal] =
    useState(false);
  const [showTopicConflictModal, setShowTopicConflictModal] = useState(false);
  const [
    showEligibilityDetectionFailModal,
    setShowEligibilityDetectionFailModal,
  ] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    file: null,
    error: "",
    loading: false,
  });

  const { isPostInappropriate, postCategory, confirmationToken } = useSelector(
    (state) => ({
      isPostInappropriate: state.posts?.isPostInappropriate,
      postCategory: state.posts?.postCategory,
      confirmationToken: state.posts?.confirmationToken,
    })
  );

  const userData = useSelector((state) => state.auth?.userData);

  const handleContentChange = (event) => {
    setFormData({
      ...formData,
      content: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      selectedFile.size <= 50 * 1024 * 1024 // 50MB
    ) {
      setFormData({
        ...formData,
        file: selectedFile,
        error: "",
      });
    } else {
      setFormData({
        ...formData,
        file: null,
        error: "Please select an image or video file under 50MB.",
      });
    }
  };

  useEffect(() => {
    if (isPostInappropriate) setShowInappropriateContentModal(true);
    if (postCategory) setShowTopicConflictModal(true);
    if (confirmationToken) setShowEligibilityDetectionFailModal(true);
  }, [isPostInappropriate, postCategory, confirmationToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { content, file, loading } = formData;
    if (loading) return;

    if (!content && !file) {
      setFormData({
        ...formData,
        error: "Please enter a message or select a file.",
      });
      return;
    }

    const newPost = new FormData();
    newPost.append("content", content);
    newPost.append("communityId", communityId);
    newPost.append("communityName", communityName);
    if (file) {
      newPost.append("file", file);
    }

    setFormData({
      ...formData,
      loading: true,
    });

    try {
      await dispatch(createPostAction(newPost));
      setFormData({
        content: "",
        file: null,
        error: "",
        loading: false,
      });
      event.target.reset();
    } catch (error) {
      setFormData({
        ...formData,
        loading: false,
      });
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      file: null,
      error: "",
    });
  };

  return (
    <>
      <InappropriatePostModal
        closeInappropriateContentModal={() => {
          setShowInappropriateContentModal(false);
          dispatch(clearCreatePostFail());
        }}
        showInappropriateContentModal={showInappropriateContentModal}
        contentType={"post"}
      />

      <TopicConflictModal
        closeTopicConflictModal={() => {
          setShowTopicConflictModal(false);
          dispatch(clearCreatePostFail());
        }}
        showTopicConflictModal={showTopicConflictModal}
        communityName={postCategory?.community}
        recommendedCommunity={postCategory?.recommendedCommunity}
      />

      <EligibilityDetectionFailModal
        closeEligibilityDetectionFailModal={() => {
          setShowEligibilityDetectionFailModal(false);
          dispatch(clearCreatePostFail());
        }}
        showEligibilityDetectionFailModal={showEligibilityDetectionFailModal}
        confirmationToken={confirmationToken}
      />

      <form onSubmit={handleSubmit} className="app-panel rounded-lg p-4 sm:p-5">
        <div className="flex gap-3 sm:gap-4">
          <img
            src={userData?.avatar}
            alt="Profile"
            className="h-11 w-11 rounded-lg object-cover border-2 border-white dark:border-gray-800 shadow-sm sm:h-12 sm:w-12"
          />
          <div className="w-full">
            <textarea
              className="app-focus min-h-[100px] w-full resize-none rounded-lg border border-transparent bg-gray-50 p-4 text-gray-900 transition-all duration-300 placeholder-gray-400 focus:border-primary-500 focus:bg-white dark:bg-gray-900/50 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:bg-gray-800"
              name="content"
              id="content"
              placeholder={`Share something with ${communityName}...`}
              value={formData.content}
              onChange={handleContentChange}
              maxLength={3000}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 pl-0 sm:flex-row sm:items-center sm:justify-between sm:pl-16">
          <div className="flex items-center gap-4">
            <label
              htmlFor="file"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-primary-500 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <HiOutlinePhotograph className="text-2xl" />
              <span className="text-sm font-semibold hidden sm:inline">Photo/Video</span>
              <input
                name="file"
                type="file"
                id="file"
                accept="image/*, video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            className={`rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-primary-500/25 transition-all duration-300 hover:from-primary-600 hover:to-primary-700 ${
              formData.loading || (!formData.content && !formData.file) ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
            type="submit"
            disabled={formData.loading || (!formData.content && !formData.file)}
          >
            {formData.loading ? "Posting..." : "Post"}
          </button>
        </div>

        {formData.file && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-3 dark:border-primary-800/30 dark:bg-primary-900/20 sm:ml-16">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-300 truncate max-w-[200px] sm:max-w-xs">{formData.file.name}</p>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-primary-500 hover:text-red-500 transition-colors"
            >
              <HiOutlineX className="text-xl" />
            </button>
          </div>
        )}

        {formData.error && <p className="mt-3 text-sm text-red-500 sm:ml-16">{formData.error}</p>}
      </form>
    </>
  );
};

export default PostForm;
