import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInAction, clearMessage } from "../redux/actions/authActions";
import { AiFillGithub } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineAdminPanelSettings, MdOutlineWaves } from "react-icons/md";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoadingText("Signing in...");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);
    await dispatch(signInAction(formData, navigate));
    setLoading(false);
    clearTimeout(timeout);
  };

  const signInError = useSelector((state) => state.auth?.signInError);
  const successMessage = useSelector((state) => state.auth?.successMessage);

  const handleClearMessage = () => {
    dispatch(clearMessage());
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 transition-colors duration-300 dark:bg-background-dark">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-700" />
      <div className="container mx-auto flex flex-col items-center justify-center px-6 relative z-10">
        <form className="app-panel w-full max-w-md rounded-lg p-6 shadow-xl sm:p-8" onSubmit={handleSubmit}>
          <div className="mx-auto flex flex-col items-center justify-center mb-8 group">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-lg bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-500 shadow-lg shadow-primary-500/25 transition-all duration-300 group-hover:scale-105">
              <MdOutlineWaves className="text-white text-4xl" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
              Social<span className="text-primary-500">Wave</span>
            </span>
            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Sign in to your community feed.
            </p>
          </div>

          {signInError && (
            <div
              className="mb-6 flex items-center justify-between rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-600 dark:text-red-400 text-sm font-medium"
              role="alert"
            >
              <div>
                <span className="block sm:inline">{signInError}</span>
              </div>
              <button
                className="font-bold hover:text-red-800 dark:hover:text-red-300 transition-colors"
                onClick={handleClearMessage}
                type="button"
              >
                <RxCross1 className="h-4 w-4" />
              </button>
            </div>
          )}
          {successMessage && (
            <div
              className="mb-6 flex items-center justify-between rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-green-600 dark:text-green-400 text-sm font-medium"
              role="alert"
            >
              <div>
                <span className="block sm:inline">{successMessage}</span>
              </div>
              <button
                className="font-bold hover:text-green-800 dark:hover:text-green-300 transition-colors"
                onClick={handleClearMessage}
                type="button"
              >
                <RxCross1 className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-center mb-8 border-b border-gray-200 dark:border-gray-800">
            <Link
              to={"/signin"}
              className="w-1/2 border-b-2 border-primary-500 pb-4 text-center font-bold text-gray-900 dark:text-white"
            >
              Sign In
            </Link>
            <Link
              to={"/signup"}
              className="w-1/2 border-b-2 border-transparent pb-4 text-center font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          <div className="relative mb-5 flex items-center">
            <span className="absolute left-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="app-focus block w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 transition-all duration-300 placeholder-gray-400 focus:border-primary-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:bg-gray-800"
              placeholder="Email address"
              required
              autoComplete="off"
            />
          </div>
          <div className="relative mb-8 flex items-center">
            <span className="absolute left-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="app-focus block w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 transition-all duration-300 placeholder-gray-400 focus:border-primary-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:bg-gray-800"
              placeholder="Password"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className={`app-focus w-full transform rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:from-primary-600 hover:to-primary-700 hover:shadow-primary-500/40 ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? (
                <ButtonLoadingSpinner loadingText={loadingText} />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <a
            href="https://github.com/hamzakh86/codeAlpha-SocialWave"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            <AiFillGithub className="mr-2 h-5 w-5" />
            <span>GitHub</span>
          </a>
          <Link
            to="/admin"
            className="flex items-center hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            <MdOutlineAdminPanelSettings className="mr-2 h-5 w-5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
