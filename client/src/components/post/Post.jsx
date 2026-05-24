import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineArchiveBox,
} from "react-icons/hi2";
import DeleteModal from "../modals/DeleteModal";
import Like from "./Like";
import "react-photo-view/dist/react-photo-view.css";
import Tooltip from "../shared/Tooltip";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth?.userData);

  const { content, fileUrl, fileType, user, community, createdAt, comments } =
    post;

  const [showModal, setShowModal] = useState(false);
  const toggleModal = (value) => {
    setShowModal(value);
  };

  return (
    <article className="app-panel app-panel-hover mb-5 rounded-lg p-4 sm:p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="rounded-lg w-12 h-12 object-cover border-2 border-white dark:border-gray-800 shadow-sm"
              src={user.avatar}
              alt="user avatar"
              loading="lazy"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-800"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {userData._id === user._id ? (
                <Link to="/profile" className="font-bold text-[17px] capitalize text-gray-900 dark:text-gray-100 hover:text-primary-500 transition-colors">
                  {user.name}
                </Link>
              ) : (
                <Link
                  to={`/user/${user._id}`}
                  className="font-bold text-[17px] capitalize text-gray-900 dark:text-gray-100 hover:text-primary-500 transition-colors"
                >
                  {user.name}
                </Link>
              )}
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{createdAt}</p>
            </div>
            <Link
              to={`/community/${community.name}`}
              className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              {community.name}
            </Link>
          </div>
        </div>
      </div>
      
      <div>
        <p
          onClick={() => {
            navigate(`/post/${post._id}`, {
              state: { from: location.pathname },
            });
          }}
            className="mb-4 cursor-pointer whitespace-pre-wrap break-words text-[16px] leading-relaxed text-gray-800 transition-colors hover:text-gray-950 dark:text-gray-200 dark:hover:text-white"
        >
          {content}
        </p>
        
        {fileUrl && <div className="mt-2 relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900/50">
          {fileUrl && fileType === "image" ? (
            <PhotoProvider
              overlayRender={() => (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 pt-12">
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-sm opacity-90 text-primary-300">{community.name}</p>
                  <p className="text-xs opacity-75 mt-1">{createdAt}</p>
                </div>
              )}
            >
              <PhotoView src={fileUrl}>
                <div className="w-full relative group cursor-zoom-in">
                  <img
                    src={fileUrl}
                    alt={content}
                    loading="lazy"
                    className="w-full h-auto max-h-[600px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </PhotoView>
            </PhotoProvider>
          ) : (
            fileUrl && (
              <div className="w-full relative">
                <video
                  className="w-full max-h-[600px] object-contain bg-black/5 dark:bg-black/20"
                  src={fileUrl}
                  controls
                />
              </div>
            )
          )}
        </div>}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Like post={post} />

          <button
            className="flex items-center gap-2 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors group"
            onClick={() => {
              navigate(`/post/${post._id}`, {
                state: { from: location.pathname },
              });
            }}
          >
            <div className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
              <HiOutlineChatBubbleOvalLeft className="text-[22px]" />
            </div>
            <span className="font-medium">{comments.length}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {userData?._id === post.user._id && (
            <Tooltip text="Delete post">
              <button
                onClick={() => toggleModal(true)}
                className="rounded-lg p-2 text-gray-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
              >
                <HiOutlineArchiveBox className="text-[22px]" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {showModal && (
        <DeleteModal
          showModal={showModal}
          postId={post._id}
          onClose={() => toggleModal(false)}
          prevPath={location.pathname}
        />
      )}
    </article>
  );
};

export default Post;
