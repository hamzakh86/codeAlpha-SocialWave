import { useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";
import Like from "./Like";
import { IoIosArrowBack } from "react-icons/io";
const SavedPost = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { content, fileUrl, user, community, createdAt, comments } = post;

  const isImageFile = useMemo(() => {
    const validExtensions = [".jpg", ".png", ".jpeg", ".gif", ".webp", ".svg"];
    const fileExtension = fileUrl?.slice(fileUrl.lastIndexOf("."));
    return validExtensions.includes(fileExtension);
  }, [fileUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <article className="app-panel app-panel-hover mb-5 w-full rounded-lg p-4 sm:p-5">
      <button
        type="button"
        aria-label="Go back"
        className="app-focus mb-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-primary-100 text-primary-600 dark:border-primary-800/40 dark:text-primary-300"
        onClick={handleBack}
      >
        <IoIosArrowBack
          className="text-xl font-semibold"
        />
      </button>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <img
            className="h-12 w-12 rounded-lg object-cover"
            src={user.avatar}
            alt="user avatar"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="truncate text-xs font-medium text-primary-500">{community.name}</p>
          </div>
        </div>
        <p className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{createdAt}</p>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          navigate(`/post/${post._id}`, {
            state: { from: location.pathname },
          });
        }}
      >
        <p className="mt-4 whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">{content}</p>
        <div className="flex justify-center">
          {fileUrl && isImageFile ? (
            <img
              className="mt-3 max-h-[620px] w-full rounded-lg object-cover"
              src={fileUrl}
              alt={content}
              loading="lazy"
            />
          ) : (
            fileUrl && (
              <video
                className="mt-3 max-h-[620px] w-full rounded-lg bg-black/5 object-contain dark:bg-black/20"
                src={fileUrl}
                controls
              />
            )
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Like post={post} />
          <Link to={`/post/${post._id}`}>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary-500 dark:text-gray-400 dark:hover:bg-gray-800">
              <HiOutlineChatBubbleOvalLeft />
              {comments.length}
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default SavedPost;
