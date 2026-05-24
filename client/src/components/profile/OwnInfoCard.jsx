import {
  FiCalendar,
  FiFileText,
  FiUsers,
  FiUserPlus,
  FiUserCheck,
} from "react-icons/fi";

const OwnInfoCard = ({ user }) => {
  const stats = [
    { label: "Posts", value: user.totalPosts, icon: <FiFileText /> },
    { label: "Communities", value: user.totalCommunities, icon: <FiUsers /> },
    { label: "Followers", value: user.followers?.length ?? 0, icon: <FiUserCheck /> },
    { label: "Following", value: user.following?.length ?? 0, icon: <FiUserPlus /> },
  ];

  return (
    <section className="app-panel my-5 rounded-lg p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile summary</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FiCalendar className="text-primary-500" />
          <span>
            Joined {user.duration} ago (
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            )
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/60"
          >
            <div className="mb-2 text-xl text-primary-500">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {user.totalPosts > 0 && (
        <div className="mt-4 rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
          <span className="font-semibold">Community activity: </span>
          <span>
            {user.totalPosts} in {user.totalPostCommunities}{" "}
            {user.totalPostCommunities === 1 ? "community" : "communities"}
          </span>
        </div>
      )}
    </section>
  );
};

export default OwnInfoCard;
