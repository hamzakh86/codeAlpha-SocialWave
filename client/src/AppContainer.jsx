import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import createAppStore from "./redux/store";
import axios from "axios";
import CommonLoading from "./components/loader/CommonLoading";
import App from "./App";
import { getTitleFromRoute } from "./utils/docTitle";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const DEFAULT_API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://codealpha-socialwave.onrender.com";
const API_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

const ErrorComponent = ({ errorMessage }) => (
  <div className="app-panel mx-4 max-w-md rounded-lg p-6 text-center">
    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10">
      !
    </div>
    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
      SocialWave is temporarily unavailable
    </h1>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{errorMessage}</p>
  </div>
);

const AppContainer = () => {
  const location = useLocation();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Check server status first
        try {
          await axios.get(`${API_URL}/server-status`);
        } catch (err) {
          console.error("Server status error:", err);
          setError("The API server is not responding. Please start the backend and refresh the page.");
          setLoading(false);
          return;
        }

        // 2. Initialize the Redux store
        const appStore = await createAppStore();
        setStore(appStore);
      } catch (err) {
        console.error("Store initialization error:", err);
        setError(`Error initializing the app: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading || error || !store) {
    return (
      <div className="flex h-screen items-center justify-center bg-background dark:bg-background-dark">
        {loading && !error ? <CommonLoading /> : <ErrorComponent errorMessage={error || "Store not initialized"} />}
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Helmet>
        <title>{getTitleFromRoute(location.pathname)}</title>
      </Helmet>
      <App />
    </Provider>
  );
};

export default AppContainer;
