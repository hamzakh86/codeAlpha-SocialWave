import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce";
import JoinModal from "../modals/JoinModal";
import { MoonLoader } from "react-spinners";
import { MdClear, MdOutlineSearch } from "react-icons/md";

const DEFAULT_API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://codealpha-socialwave.onrender.com";
const BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

const Search = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [community, setCommunity] = useState(null);
  const [joinedCommunity, setJoinedCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;
  const setInitialValue = () => {
    setUsers([]);
    setPosts([]);
    setCommunity(null);
    setJoinedCommunity(null);
    setLoading(false);
  };

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((q) => {
        if (!q.trim()) return;
        setLoading(true);
        const encodedQuery = encodeURIComponent(q);
        axios
          .get(`${BASE_URL}/search?q=${encodedQuery}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            const { posts, users, community, joinedCommunity } = res.data;
            setPosts(posts);
            setUsers(users);
            setCommunity(community);
            setJoinedCommunity(joinedCommunity);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }, 800),
    [accessToken]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setInitialValue();
      return;
    }

    debouncedHandleSearch(value);
  };

  const clearValues = () => {
    setInitialValue();
    setInputValue("");
  };

  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
      setInitialValue();
    };
  }, [debouncedHandleSearch]);

  const [joinModalVisibility, setJoinModalVisibility] = useState(false);
  const toggleModal = () => {
    setJoinModalVisibility((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MdOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
        <input
          type="text"
          id="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search people, posts, communities"
          className="app-focus h-10 w-full rounded-lg border border-gray-200 bg-white/90 py-1 pl-10 pr-10 text-sm shadow-sm transition duration-300 placeholder:text-gray-400 focus:border-primary-500 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-100"
          aria-label="Search"
          autoComplete="off"
        />
        {inputValue !== "" && (
          <button
            className="absolute top-0 right-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            onClick={clearValues}
          >
            <MdClear />
          </button>
        )}
      </div>

      {inputValue !== "" && (
        <div
          onBlur={() => !community && clearValues()}
          className="absolute left-1/2 top-12 z-50 max-h-[70vh] w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-2xl shadow-gray-900/10 md:left-0 md:w-full md:translate-x-0 dark:border-gray-800 dark:bg-gray-950"
        >
          {loading && (
            <div className="flex items-center justify-center py-2 px-2">
              <MoonLoader size={20} color={"#00bcd4"} />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Searching...</span>
            </div>
          )}
          {posts.length > 0 && (
            <ul className="z-30">
              {posts.map((post) => (
                <li key={post._id} className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                  <div
                    onClick={() => {
                      navigate(`/post/${post._id}`);
                      clearValues();
                    }}
                    className="block cursor-pointer text-sm text-gray-700 hover:text-primary-500 dark:text-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="h-8 w-8 rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {post.title || "Post"}
                        </div>
                        <div className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {post.content}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Posted by {post.user.name} in {post.community.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {users.length > 0 && (
            <ul className="z-30">
              {users.map((user) => (
                <li key={user._id} className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                  <div
                    onClick={() => {
                      navigate(`/user/${user._id}`);
                      clearValues();
                    }}
                    className="block cursor-pointer text-sm text-gray-700 hover:text-primary-500 dark:text-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {community && (
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={community.banner}
                    alt={community.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div className=" px-2 flex justify-between items-center gap-2">
                  <div className="">
                    <p className="font-medium">{community.name}</p>

                    <p className="text-sm line-clamp-2">
                      {community.description}
                    </p>
                  </div>

                  {!community.isMember && (
                    <>
                      <JoinModal
                        show={joinModalVisibility}
                        onClose={() => {
                          toggleModal(false);
                          setCommunity(null);
                        }}
                        community={community}
                      />
                      <button
                        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                        onClick={() => toggleModal(true)}
                      >
                        Join
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {joinedCommunity && (
            <div
              key={joinedCommunity._id}
              onClick={() => {
                navigate(`/community/${joinedCommunity.name}`);
                clearValues();
              }}
              className="block cursor-pointer border-b border-gray-100 px-4 py-3 text-sm text-gray-700 hover:text-primary-500 dark:border-gray-800 dark:text-gray-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    src={joinedCommunity.banner}
                    alt={joinedCommunity.name}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-md text-primary">
                    {joinedCommunity.name}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {joinedCommunity.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
