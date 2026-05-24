import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdOutlineAdminPanelSettings, MdOutlineWaves } from "react-icons/md";
import { signInAction } from "../redux/actions/adminActions";
import { useDispatch, useSelector } from "react-redux";

const AdminSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const signInError = useSelector((state) => state.admin?.signInError);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    setSigningIn(true);
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };

    const signedIn = await dispatch(signInAction(data));
    setSigningIn(false);
    if (signedIn) {
      navigate("/admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 dark:bg-background-dark">
      <div className="app-panel mx-auto w-full max-w-md overflow-hidden rounded-lg p-6 shadow-xl sm:p-8">
        <div>
          <div className="mx-auto flex flex-col items-center justify-center">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-lg bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-500 shadow-lg shadow-primary-500/25">
              <MdOutlineWaves className="text-4xl text-white" />
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-950 dark:text-white">
              <MdOutlineAdminPanelSettings className="text-primary-500" />
              Admin
            </div>
          </div>

          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">Sign in to manage SocialWave</p>
          <form onSubmit={handleSubmit}>
            <div className="w-full mt-4">
              <input
                value={username}
                onChange={handleUsernameChange}
                className="app-focus mt-2 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-800"
                type="text"
                placeholder="Username"
                aria-label="Username"
                autoComplete="username"
                required
              />
            </div>
            <div className="w-full mt-4">
              <input
                value={password}
                onChange={handlePasswordChange}
                className="app-focus mt-2 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:bg-gray-800"
                type="password"
                placeholder="Password"
                aria-label="Password"
                autoComplete="current-password"
                required
              />
            </div>
            {signInError && (
              <div className="relative mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                <span className="block sm:inline">{signInError}</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <Link to="/" className="flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400">
                <IoIosArrowRoundBack className="inline-block w-4 h-4 mr-2" />
                Back to home
              </Link>
              <button
                disabled={signingIn}
                type="submit"
                className="app-focus rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signingIn ? (
                  <ButtonLoadingSpinner loadingText={"Signing in..."} />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
