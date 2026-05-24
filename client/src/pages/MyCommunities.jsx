import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getJoinedCommunitiesAction } from "../redux/actions/communityActions";
import JoinedCommunityCard from "../components/community/JoinedCommunityCard";
import CommonLoading from "../components/loader/CommonLoading";

const MyCommunities = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const joinedCommunities = useSelector(
    (state) => state.community?.joinedCommunities
  );

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getJoinedCommunitiesAction());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const communityCards = useMemo(() => {
    if (!joinedCommunities) {
      return null;
    }
    return joinedCommunities.map((community) => (
      <div key={community._id} className="flex items-center">
        <JoinedCommunityCard className="mb-5" community={community} />
      </div>
    ));
  }, [joinedCommunities]);

  if (loading) {
    return (
      <div className="col-span-2 flex h-screen items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <div className="main-section">
      <div className="app-panel mb-5 rounded-lg p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          My communities
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your active spaces, grouped in one place.
        </p>
      </div>
      {joinedCommunities?.length === 0 ? (
        <div className="app-panel rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
          You have not joined any communities yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{communityCards}</div>
      )}
    </div>
  );
};

export default MyCommunities;
