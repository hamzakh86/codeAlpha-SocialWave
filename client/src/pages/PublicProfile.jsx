import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  getPublicUserAction,
  getPublicUsersAction,
  unfollowUserAction,
  followUserAction,
} from "../redux/actions/userActions";
import PublicPost from "../components/profile/PublicPost";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlineFieldTime } from "react-icons/ai";
import { FiUsers, FiUser, FiUserMinus, FiUserPlus } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi2";
import CommonLoading from "../components/loader/CommonLoading";
import Tooltip from "../components/shared/Tooltip";

const PublicProfile = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [followLoading, setFollowLoading] = useState(false);
  const [unfollowLoading, setUnfollowLoading] = useState(false);

  const userData = useSelector((state) => state.auth?.userData);
  const userProfile = useSelector((state) => state.user?.publicUserProfile);
  const isUserFollowing = useSelector((state) => state.user?.isFollowing);
  const isModerator = useSelector(
    (state) => state.auth?.userData?.role === "moderator"
  );

  const publicUserId = location.pathname.split("/")[2];

  useEffect(() => {
    dispatch(getPublicUserAction(publicUserId));
  }, [dispatch, isUserFollowing, publicUserId]);

  useEffect(() => {
    if (publicUserId === userData?._id) {
      navigate("/profile", { replace: true });
    }
  }, [publicUserId, userData, navigate]);

  const handleUnfollow = async (publicUserId) => {
    setUnfollowLoading(true);
    await dispatch(unfollowUserAction(publicUserId));
    await dispatch(getPublicUsersAction());
    setUnfollowLoading(false);
  };

  const handleFollow = async (publicUserId) => {
    setFollowLoading(true);
    await dispatch(followUserAction(publicUserId));
    await dispatch(getPublicUsersAction());
    setFollowLoading(false);
  };

  if (!userProfile) {
    return (
      <div className="col-span-2 flex items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  const {
    name,
    avatar,
    cover,
    location: userLocation,
    bio,
    role,
    interests,
    totalPosts,
    totalCommunities,
    joinedOn,
    totalFollowers,
    totalFollowing,
    isFollowing,
    followingSince,
    postsLast30Days,
    commonCommunities,
  } = userProfile;

  const Button = ({ loading, onClick, tooltipText, icon, color }) => (
    <button
      onClick={onClick}
      type="button"
      className={`app-focus absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-lg border text-sm font-semibold shadow-md ${color} bg-white dark:bg-gray-900`}
      disabled={loading}
    >
      {loading ? (
        <span className="text-xs">Wait</span>
      ) : (
        <Tooltip text={tooltipText}>{icon}</Tooltip>
      )}
    </button>
  );

  const FollowButton = ({ loading, onClick, name }) => (
    <Button
      loading={loading}
      onClick={onClick}
      tooltipText={`Follow ${name}`}
      icon={<FiUserPlus />}
      color="text-primary border-primary"
    />
  );

  const UnfollowButton = ({ loading, onClick, name }) => (
    <Button
      loading={loading}
      onClick={onClick}
      tooltipText={`Unfollow ${name}`}
      icon={<FiUserMinus />}
      color="text-red-500 border-red-500"
    />
  );

  return (
    <div className="main-section">
      <div className="app-panel mb-5 overflow-hidden rounded-lg">
        <div
          className="relative h-36 bg-gradient-to-r from-primary-600 to-accent-500 bg-cover bg-center transition-all duration-300"
          style={cover ? { backgroundImage: `url(${cover})` } : {}}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent"></div>
        </div>

        <div className="relative px-5 pb-6 sm:px-6">
          <div className="flex flex-col items-center -mt-16">
            <div className="relative">
              <img
                className="h-32 w-32 rounded-lg object-cover border-4 border-white dark:border-gray-900 shadow-xl"
                src={avatar}
                alt="Profile"
                loading="lazy"
              />
              <UnfollowButton
                loading={unfollowLoading}
                onClick={() => handleUnfollow(publicUserId)}
                name={name}
              />
              {!isModerator && !isFollowing && (
                <FollowButton
                  loading={followLoading}
                  onClick={() => handleFollow(publicUserId)}
                  name={name}
                />
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
              {name}
            </h1>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <CiLocationOn className="text-accent-500 text-lg font-bold" />
              {userLocation === "" ? "Location unknown" : userLocation}
            </p>
            {role === "moderator" ? (
              <p className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">
                Moderator
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="app-panel rounded-lg p-5">
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-900/60 dark:text-gray-300">
          {bio || `${name} has not added a bio yet.`}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <AiOutlineFieldTime className="mb-2 text-xl text-primary-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{joinedOn}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <HiOutlineDocumentText className="mb-2 text-xl text-primary-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalPosts}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <FiUsers className="mb-2 text-xl text-primary-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Communities</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalCommunities}</p>
          </div>
          <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <FiUser className="mb-2 text-xl text-primary-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalFollowing}</p>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <HiOutlineDocumentText className="text-primary-500" />
          {postsLast30Days} {postsLast30Days === 1 ? "post" : "posts"} in the last 30 days
        </p>

        {isFollowing && role !== "moderator" ? (
          <>
            {totalFollowers === 1 ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiUser className="text-primary-500" />
                Followed by you
              </p>
            ) : (
              <p className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiUser className="text-primary-500" />
                {`Followed by you and `}
                <span className="font-semibold">
                  {totalFollowers - 1} others
                </span>
              </p>
            )}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              You are following
              <span className="font-semibold text-primary-600 dark:text-primary-300"> {name} </span>
              since {followingSince}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {role === "moderator" ? null : totalFollowers === 1 ? (
              <span className="font-semibold">{totalFollowers} follower</span>
            ) : (
              <span className="font-semibold">{totalFollowers} followers</span>
            )}
          </p>
        )}

        {commonCommunities?.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">You have no communities in common.</p>
        ) : (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            You both are members of{" "}
            {commonCommunities?.slice(0, 1).map((c) => (
              <Fragment key={c._id}>
                <Link
                  className="font-bold text-primary-600 hover:underline dark:text-primary-300"
                  to={`/community/${c.name}`}
                >
                  {c.name}
                </Link>
              </Fragment>
            ))}
            {commonCommunities?.length > 1 && (
              <span>
                {" and "}
                <span className="tooltip">
                  {`${commonCommunities?.length - 1} other ${
                    commonCommunities?.length - 1 === 1
                      ? "community"
                      : "communities"
                  }`}
                  <span className="tooltiptext">
                    {commonCommunities
                      ?.slice(1)
                      .map((c) => `${c.name}`)
                      .join(", ")}
                  </span>
                </span>
              </span>
            )}
          </p>
        )}
        <div className="mt-5 flex flex-col">
          <p className="mb-2 font-semibold text-gray-900 dark:text-white">Interests</p>
          {interests ? (
            <div className="flex flex-wrap gap-2">
              {interests.split(",").map((interest, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-lg border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700 dark:border-primary-800/30 dark:bg-primary-500/10 dark:text-primary-300"
                >
                  {interest.trim()}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{name} has not added any interests.</p>
          )}
        </div>
      </div>
      {isUserFollowing && <PublicPost publicUserId={publicUserId} />}
    </div>
  );
};

export default PublicProfile;
