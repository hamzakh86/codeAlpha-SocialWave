import { useEffect, useState } from "react";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getCommunityAction } from "../../redux/actions/communityActions";
import Save from "./Save";
import Like from "./Like";
import CommentForm from "../form/CommentForm";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import DeleteModal from "../modals/DeleteModal";
import { IoIosArrowBack } from "react-icons/io";
import CommonLoading from "../loader/CommonLoading";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import ReportPostModal from "../modals/ReportPostModal";
import { VscReport } from "react-icons/vsc";
import Tooltip from "../shared/Tooltip";

const PostView = ({ post, userData }) => {
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    content,
    fileUrl,
    fileType,
    user,
    community,
    dateTime,
    comments,
    savedByCount,
    isReported,
  } = post;

  useEffect(() => {
    dispatch(getCommunityAction(community.name)).finally(() => setLoading(false));
  }, [dispatch, community.name]);

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (value) => {
    setShowModal(value);
  };

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportedPost, setIsReportedPost] = useState(isReported);

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleReportClose = () => {
    setIsReportModalOpen(false);
  };

  if (loading) {
    return (
      <div className="main-section flex justify-center items-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <article className="main-section app-panel rounded-lg p-4 sm:p-5">
      <button
        type="button"
        aria-label="Go back"
        className="app-focus mb-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-primary-100 text-primary-600 dark:border-primary-800/40 dark:text-primary-300"
        onClick={() => navigate(location.state?.from || "/")}
      >
        <IoIosArrowBack
          className="text-lg font-semibold"
        />
      </button>

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="h-12 w-12 rounded-lg object-cover"
            src={user.avatar}
            alt="user avatar"
            loading="lazy"
          />
          <div className="flex min-w-0 flex-col">
            {userData._id === user._id ? (
              <Link to="/profile" className="truncate text-lg font-semibold text-gray-900 transition-colors hover:text-primary-500 dark:text-white">
                {user.name}
              </Link>
            ) : (
              <Link to={`/user/${user._id}`} className="truncate text-lg font-semibold text-gray-900 transition-colors hover:text-primary-500 dark:text-white">
                {user.name}
              </Link>
            )}
            <Link
              to={`/community/${community.name}`}
              className="truncate text-xs font-medium text-primary-500"
            >
              {community.name}
            </Link>
          </div>
        </div>

        <span className="shrink-0 self-center text-xs text-gray-500 dark:text-gray-400">{dateTime}</span>
      </div>

      <div className="mb-4">
        <p className="my-3 whitespace-pre-wrap break-words leading-relaxed text-gray-800 dark:text-gray-200">{content}</p>
        {fileUrl && <div className="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900/50">
          {fileUrl && fileType === "image" ? (
            <PhotoProvider
              overlayRender={() => (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-white">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-primary-300">{community.name}</p>
                  <p className="mt-1 text-xs opacity-75">{dateTime}</p>
                </div>
              )}
            >
              <PhotoView src={fileUrl}>
                <div className="w-full cursor-zoom-in">
                  <img
                    src={fileUrl}
                    alt={content}
                    loading="lazy"
                    className="max-h-[720px] w-full object-cover"
                  />
                </div>
              </PhotoView>
            </PhotoProvider>
          ) : (
            fileUrl && (
              <div className="w-full">
                <video
                  className="mx-auto max-h-[720px] w-full bg-black/5 object-contain focus:outline-none dark:bg-black/20"
                  src={fileUrl}
                  controls
                />
              </div>
            )
          )}
        </div>}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Like post={post} />
          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary-500 dark:text-gray-400 dark:hover:bg-gray-800">
            <HiOutlineChatBubbleOvalLeft className="text-2xl" />
            <span>{comments.length}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Save postId={post._id} />
          <Tooltip text="Saved by" className="items-center">
            <div className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <HiOutlineArchiveBox className="text-2xl" />
              {savedByCount}
            </div>
          </Tooltip>
          {isReportedPost ? (
            <Tooltip text="Reported" className="items-center">
              <button disabled className="rounded-lg p-2 text-green-500">
                <VscReport className="text-2xl" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip text="Report">
              <button onClick={handleReportClick} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-500 dark:text-gray-400 dark:hover:bg-gray-800">
                <VscReport className="text-2xl" />
              </button>
            </Tooltip>
          )}
          {userData?._id === post.user._id && (
            <Tooltip text="Delete">
              <button
                onClick={() => toggleModal(true)}
                className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <HiOutlineArchiveBox className="text-2xl" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        showModal={showModal}
        postId={post._id}
        onClose={() => toggleModal(false)}
        prevPath={location.state?.from || "/"}
      />

      <ReportPostModal
        isOpen={isReportModalOpen}
        onClose={handleReportClose}
        postId={post._id}
        communityId={community._id}
        setReportedPost={setIsReportedPost}
      />

      <div>
        <CommentForm communityId={community._id} postId={post._id} />
      </div>
    </article>
  );
};

export default PostView;
