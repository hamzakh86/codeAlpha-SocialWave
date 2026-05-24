import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getServicePreferencesAction,
  updateServicePreferencesAction,
} from "../../redux/actions/adminActions";

const Settings = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const servicePreferences = useSelector(
    (state) => state.admin?.servicePreferences
  );
  const [usePerspectiveAPI, setUsePerspectiveAPI] = useState(false);
  const [
    categoryFilteringServiceProvider,
    setCategoryFilteringServiceProvider,
  ] = useState("");
  const [categoryFilteringRequestTimeout, setCategoryFilteringRequestTimeout] =
    useState(0);

  useEffect(() => {
    dispatch(getServicePreferencesAction());
  }, [dispatch]);

  useEffect(() => {
    if (servicePreferences) {
      setUsePerspectiveAPI(servicePreferences.usePerspectiveAPI);
      setCategoryFilteringServiceProvider(
        servicePreferences.categoryFilteringServiceProvider
      );
      setCategoryFilteringRequestTimeout(
        servicePreferences.categoryFilteringRequestTimeout
      );
      setIsLoading(false);
    }
  }, [servicePreferences]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setIsSuccess(false);
    try {
      await dispatch(
        updateServicePreferencesAction({
          usePerspectiveAPI,
          categoryFilteringServiceProvider,
          categoryFilteringRequestTimeout,
        })
      );
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !servicePreferences) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 w-full border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white mt-3 transition-colors duration-300">
      <h2 className="font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-center text-gray-700 dark:text-gray-200">
        Service Preferences
      </h2>

      {isSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-2 mb-4 rounded">
          Service Preferences updated successfully!
        </div>
      )}

      <div className="flex items-center mb-4">
        <div>Use Perspective API for content moderation</div>
        <div className="ml-auto">
          <input
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            checked={usePerspectiveAPI}
            onChange={(e) => setUsePerspectiveAPI(e.target.checked)}
          />
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div>Category filtering service provider</div>
        <div className="ml-auto">
          <select
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
            value={categoryFilteringServiceProvider}
            onChange={(e) =>
              setCategoryFilteringServiceProvider(e.target.value)
            }
          >
            <option value="" className="dark:bg-gray-850">Select a provider</option>
            <option value="TextRazor" className="dark:bg-gray-850">TextRazor</option>
            <option value="InterfaceAPI" className="dark:bg-gray-850">InterfaceAPI</option>
            <option value="ClassifierAPI" className="dark:bg-gray-850">ClassifierAPI</option>
            <option value="disabled" className="dark:bg-gray-850">Disabled</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div>Category filtering request timeout (ms)</div>
        <div className="ml-auto">
          <input
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
            type="number"
            value={categoryFilteringRequestTimeout}
            min={0}
            max={500000}
            required
            onChange={(e) => {
              setCategoryFilteringRequestTimeout(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-750 disabled:opacity-50"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
