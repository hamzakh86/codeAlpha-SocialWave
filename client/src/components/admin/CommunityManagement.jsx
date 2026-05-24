import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCommunitiesAction,
  getModeratorsAction,
  addModeratorAction,
  removeModeratorAction,
  getCommunityAction,
} from "../../redux/actions/adminActions";

const CommunityManagement = () => {
  const dispatch = useDispatch();
  const communities = useSelector((state) => state.admin?.communities);
  const moderators = useSelector((state) => state.admin?.moderators);
  const community = useSelector((state) => state.admin?.community);

  useEffect(() => {
    dispatch(getCommunitiesAction());
    dispatch(getModeratorsAction());
  }, [dispatch]);

  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedCommunityData, setSelectedCommunityData] = useState(null);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [newModerator, setNewModerator] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingCommunity, setIsChangingCommunity] = useState(false);

  const handleCommunitySelect = async (community) => {
    setSelectedCommunity(community);
    setIsChangingCommunity(true);
    await dispatch(getCommunityAction(community._id));
    setIsChangingCommunity(false);
  };

  useEffect(() => {
    setSelectedCommunityData(community);
  }, [community]);

  const handleModeratorSelect = (moderator) => {
    setSelectedModerator(moderator);
  };

  const handleRemoveModerator = async (moderator) => {
    setIsUpdating(true);
    await dispatch(
      removeModeratorAction(selectedCommunityData._id, moderator._id)
    );
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(getModeratorsAction());
    setIsUpdating(false);
  };
  const handleAddModerator = async () => {
    setIsUpdating(true);
    await dispatch(addModeratorAction(selectedCommunityData._id, newModerator));
    await dispatch(getCommunityAction(selectedCommunityData._id));
    await dispatch(getModeratorsAction());
    setNewModerator("");
    setIsUpdating(false);
  };

  if (!communities || !moderators) {
    return (
      <div className="flex items-center justify-center mt-5 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex gap-2 h-[85vh] w-full mt-3 border border-gray-200 dark:border-gray-700 rounded-md transition-colors duration-300">
      {/* Left column */}
      <div className="flex flex-col w-full bg-white dark:bg-gray-800 shadow-inner rounded-l-md border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-bold p-4 text-center border-b-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
          Communities
        </h1>
        <div className="flex flex-col overflow-y-auto">
          {communities.map((community) => (
            <div
              key={community._id}
              className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 flex items-center transition-colors ${
                selectedCommunity?._id === community._id
                  ? "bg-blue-50 dark:bg-blue-900/30"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => handleCommunitySelect(community)}
            >
              <img
                src={community.banner}
                alt={community.name}
                className="w-10 h-10 rounded-full mr-2 md:mr-4 object-cover"
              />
              <span className="text-gray-700 dark:text-gray-200 text-xs md:text-base font-medium">
                {community.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col w-full bg-white dark:bg-gray-800 rounded-r-md px-5 py-5 border-l border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
        {isChangingCommunity ? (
          <div className="flex justify-center items-center h-screen">
            <span className="admin-loader"></span>
          </div>
        ) : selectedCommunityData ? (
          <>
            <h1 className="font-bold text-lg border-b border-gray-300 dark:border-gray-600 pb-1 mb-2 text-gray-900 dark:text-white">
              {selectedCommunityData.name}
            </h1>

            {isUpdating && (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-2 mb-4 rounded">
                Updating...
              </div>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-300 mb-0.5">
              Total Moderators: {selectedCommunityData.moderatorCount}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Total Members: {selectedCommunityData.memberCount}
            </span>

            <div className="flex flex-col md:flex-row gap-5">
              {/* Moderators list */}
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <h2 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Moderators</h2>
                {selectedCommunityData.moderators?.length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">No moderators</span>
                )}
                <div className="flex flex-col gap-1">
                  {selectedCommunityData.moderators?.map((moderator) => (
                    <div
                      key={moderator._id}
                      className={`p-2 cursor-pointer border border-gray-200 dark:border-gray-600 flex flex-col md:flex-row gap-2 justify-between items-center rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        selectedModerator?._id === moderator._id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                      onClick={() => handleModeratorSelect(moderator)}
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-200">{moderator.name}</span>
                      <button
                        disabled={isUpdating}
                        className={`bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 px-4 py-1 text-sm text-white rounded transition-colors ${
                          isUpdating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleRemoveModerator(moderator)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add moderator form */}
              <div className="flex flex-col w-full gap-2 md:w-1/2">
                <h2 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Add Moderator</h2>
                <div className="flex flex-col gap-2 md:flex-row">
                  <select
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                    value={newModerator}
                    onChange={(e) => setNewModerator(e.target.value)}
                  >
                    <option value="">Select a moderator</option>
                    {moderators?.map((moderator) => (
                      <option key={moderator._id} value={moderator._id}>
                        {moderator.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                    }
                    className={`p-2 bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors ${
                      !newModerator ||
                      isUpdating ||
                      selectedCommunityData.moderators?.find(
                        (moderator) => moderator._id === newModerator
                      )
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleAddModerator}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-medium text-gray-400 dark:text-gray-500">
              Select a community to view details
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityManagement;
