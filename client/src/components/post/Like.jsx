import { useState, useEffect } from "react";
import { HiOutlineHandThumbUp, HiHandThumbUp } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  likePostAction,
  unlikePostAction,
} from "../../redux/actions/postActions";

const Like = ({ post }) => {
  const dispatch = useDispatch();
  const { _id, likes } = post;
  const userData = useSelector((state) => state.auth?.userData);

  const [likeState, setLikeState] = useState({
    liked: post.likes.includes(userData?._id),
    localLikes: likes.length,
  });

  useEffect(() => {
    setLikeState({
      liked: post.likes.includes(userData?._id),
      localLikes: post.likes.length,
    });
  }, [post.likes, userData?._id]);

  const toggleLike = async (e) => {
    e.preventDefault();
    const optimisticLikes = likeState.liked
      ? likeState.localLikes - 1
      : likeState.localLikes + 1;

    setLikeState((prevState) => ({
      ...prevState,
      liked: !prevState.liked,
      localLikes: optimisticLikes,
    }));

    try {
      if (likeState.liked) {
        await dispatch(unlikePostAction(_id));
      } else {
        await dispatch(likePostAction(_id));
      }
    } catch (error) {
      setLikeState((prevState) => ({
        ...prevState,
        liked: !prevState.liked,
        localLikes: likeState.localLikes,
      }));
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors ${
        likeState.liked
          ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300"
          : "text-gray-500 hover:bg-gray-100 hover:text-primary-500 dark:text-gray-400 dark:hover:bg-gray-800"
      }`}
      aria-label={likeState.liked ? "Unlike post" : "Like post"}
    >
      {likeState.liked ? (
        <HiHandThumbUp className="text-2xl" />
      ) : (
        <HiOutlineHandThumbUp className="text-2xl" />
      )}{" "}
      {likeState.localLikes}
    </button>
  );
};

export default Like;
