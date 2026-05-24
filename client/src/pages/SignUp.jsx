import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signUpAction, clearMessage } from "../redux/actions/authActions";
import { Link } from "react-router-dom";
import ContextAuthModal from "../components/modals/ContextAuthModal";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineWaves } from "react-icons/md";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const SignUpNew = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUpError = useSelector((state) => state.auth?.signUpError);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (e.target.value.includes("mod.socialewave.com")) {
      setIsModerator(true);
    } else {
      setIsModerator(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAvatar(null);
      setAvatarError(null);
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      setAvatar(null);
      setAvatarError("Please upload a valid image file (jpeg, jpg, png)");
    } else if (file.size > 10 * 1024 * 1024) {
      setAvatar(null);
      setAvatarError("Please upload an image file less than 10MB");
    } else {
      setAvatar(file);
      setAvatarError(null);
    }
  };

  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Signing up...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("role", "general");
    formData.append("isConsentGiven", isConsentGiven.toString());

    const timeout = setTimeout(() => {
      setLoadingText(
        "This is taking longer than usual. Please wait while backend services are getting started."
      );
    }, 5000);

    await dispatch(signUpAction(formData, navigate, isConsentGiven, email));
    setLoading(false);
    setIsConsentGiven(false);
    clearTimeout(timeout);
  };

  const handleClearError = () => {
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
              Create your account and start connecting.
            </p>
          </div>

          {signUpError &&
            Array.isArray(signUpError) &&
            signUpError.map((err, i) => (
              <div
                className="mb-4 flex items-center justify-between rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-red-600 dark:text-red-400 text-sm font-medium"
                role="alert"
                key={i}
              >
                <span className="ml-2 block sm:inline">{err}</span>
                <button
                  className="font-bold hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  onClick={handleClearError}
                  type="button"
                >
                  <RxCross1 className="h-4 w-4" />
                </button>
              </div>
            ))}

          <div className="flex items-center justify-center mb-8 border-b border-gray-200 dark:border-gray-800">
            <Link
              to={"/signin"}
              className="w-1/2 border-b-2 border-transparent pb-4 text-center font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to={"/signup"}
              className="w-1/2 border-b-2 border-primary-500 pb-4 text-center font-bold text-gray-900 dark:text-white"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="app-focus block w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 transition-all duration-300 placeholder-gray-400 focus:border-primary-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:bg-gray-800"
              placeholder="Username"
              required
              autoComplete="off"
            />
          </div>

          <label
            htmlFor="avatar"
            className="group mx-auto mb-5 flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-center transition-colors hover:bg-white dark:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <h2 className="text-gray-600 dark:text-gray-300 font-medium">Profile Photo</h2>
            <input
              id="avatar"
              type="file"
              className="hidden"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              autoComplete="off"
            />
          </label>
          
          {avatar && (
            <div className="mb-5 flex items-center justify-center">
              <span className="font-medium text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full truncate max-w-[250px]">
                {avatar.name}
              </span>
            </div>
          )}
          {avatarError && (
            <div className="mb-5 flex items-center justify-center">
              <span className="text-red-500 text-sm font-medium">{avatarError}</span>
            </div>
          )}

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
              value={email}
              onChange={handleEmailChange}
              type="email"
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
              onChange={handlePasswordChange}
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
                <span>Create Account</span>
              )}
            </button>

            <div onClick={() => setIsModalOpen(true)} className="mt-6 flex justify-center">
              {isConsentGiven && !isModerator ? (
                <p className="cursor-pointer rounded-full border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 px-5 py-2 text-center text-xs font-bold text-green-600 dark:text-green-400 transition-colors hover:bg-green-100 dark:hover:bg-green-900/40">
                  ✓ Context-Based Auth Enabled
                </p>
              ) : (
                <p className="cursor-pointer rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-5 py-2 text-center text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                  + Enable Context-Based Auth
                </p>
              )}
            </div>

            <div>
              <ContextAuthModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setIsConsentGiven={setIsConsentGiven}
                isModerator={isModerator}
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpNew;
