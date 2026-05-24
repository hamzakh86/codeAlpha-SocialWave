import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  getUserAction,
  updateUserAction,
} from "../../redux/actions/userActions";
import { setUserData } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { FiUser, FiMapPin, FiEdit, FiCamera, FiImage } from "react-icons/fi";

const suggestedInterests = [
  "🎨 Art",
  "📚 Books",
  "💼 Business",
  "🚗 Cars",
  "📖 Comics",
  "🌍 Culture",
  "✏️ Design",
  "🍽️ Food",
  "🎮 Gaming",
  "🎶 Music",
  "🏋️ Fitness",
  "🏞️ Travel",
  "🎯 Sports",
  "🎬 Movies",
  "📺 TV Shows",
  "📷 Photography",
  "💻 Technology",
  "🧘‍♀️ Yoga",
  "🌱 Sustainability",
  "📝 Writing",
];

const ProfileUpdateModal = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(user.name ? user.name : "");
  const [bio, setBio] = useState(user.bio ? user.bio : "");
  const [location, setLocation] = useState(user.location ? user.location : "");
  const [interests, setInterests] = useState(
    user.interests ? user.interests : ""
  );
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar ? user.avatar : "");
  const [coverPreview, setCoverPreview] = useState(user.cover ? user.cover : "");

  useEffect(() => {
    if (isOpen) {
      setName(user.name ? user.name : "");
      setBio(user.bio ? user.bio : "");
      setLocation(user.location ? user.location : "");
      setInterests(user.interests ? user.interests : "");
      setAvatarFile(null);
      setCoverFile(null);
      setAvatarPreview(user.avatar ? user.avatar : "");
      setCoverPreview(user.cover ? user.cover : "");
    }
  }, [isOpen, user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("interests", interests);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (coverFile) {
      formData.append("cover", coverFile);
    }

    try {
      const result = await dispatch(updateUserAction(user._id, formData));

      // Mettre à jour localStorage directement avec les valeurs du formulaire
      // (sans dépendre du format de réponse du serveur)
      const profile = JSON.parse(localStorage.getItem("profile"));
      if (profile) {
        profile.user = {
          ...profile.user,
          name: name || profile.user.name,
          bio: bio,
          location: location,
          interests: interests,
        };

        // Si le serveur a retourné un objet utilisateur complet (serveur local),
        // utiliser les URLs d'avatar/cover du serveur
        if (result && result._id) {
          if (result.avatar) profile.user.avatar = result.avatar;
          if (result.cover) profile.user.cover = result.cover;
        }

        localStorage.setItem("profile", JSON.stringify(profile));
        dispatch(setUserData(profile.user));
      }

      // Rafraîchir les données complètes (posts, stats, etc.) depuis le serveur
      dispatch(getUserAction(user._id));

      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 text-center sm:block sm:p-0 md:pb-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block w-full transform rounded-md bg-white dark:bg-gray-800 px-4 pb-4 pt-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:p-5 sm:align-middle md:max-w-xl overflow-y-auto max-h-[90vh]">
              <div className="w-full">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white font-bold"
                  >
                    Update Profile
                  </Dialog.Title>

                  {/* Profile Picture Upload */}
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <FiCamera className="text-gray-600 dark:text-gray-400" />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Profile Picture
                      </label>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      {avatarPreview && (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="h-12 w-12 rounded-full object-cover border"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Cover Photo Upload */}
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <FiImage className="text-gray-600 dark:text-gray-400" />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cover Photo
                      </label>
                    </div>
                    <div className="mt-2 flex flex-col space-y-2">
                      {coverPreview && (
                        <div
                          className="h-20 w-full rounded-md bg-cover bg-center border"
                          style={{ backgroundImage: `url(${coverPreview})` }}
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-gray-600 dark:text-gray-400" />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                    </div>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-b border-gray-300 dark:border-gray-600 bg-transparent dark:text-white p-2 outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Bio Input */}
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-gray-600 dark:text-gray-400 animate-pulse" />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bio
                      </label>
                    </div>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-b border-gray-300 dark:border-gray-600 bg-transparent dark:text-white p-2 outline-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  {/* Location Input */}
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <FiMapPin className="text-gray-600 dark:text-gray-400" />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Location
                      </label>
                    </div>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-b border-gray-300 dark:border-gray-600 bg-transparent dark:text-white p-2 outline-none"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  {/* Interests Input */}
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <FiEdit className="text-gray-600 dark:text-gray-400" />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Interests (Separated by comma)
                      </label>
                    </div>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-b border-gray-300 dark:border-gray-600 bg-transparent dark:text-white p-2 outline-none"
                      value={interests}
                      onChange={(e) => {
                        if (e.target.value.length <= 50) {
                          setInterests(e.target.value);
                        }
                      }}
                      maxLength={50}
                    />

                    <div className="mt-4 h-20 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {suggestedInterests.map((interest, index) => (
                          <button
                            key={index}
                            type="button"
                            disabled={isUpdating || interests.length >= 50}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() =>
                              setInterests(
                                interests === ""
                                  ? interest
                                  : interests + ", " + interest
                              )
                            }
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  disabled={isUpdating}
                  type="button"
                  className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                    isUpdating
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }`}
                  onClick={handleUpdateProfile}
                >
                  {isUpdating ? (
                    <ButtonLoadingSpinner loadingText={"Updating..."} />
                  ) : (
                    <span>Update</span>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ProfileUpdateModal;
