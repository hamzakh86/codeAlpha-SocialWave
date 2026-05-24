import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import CommonLoading from "../components/loader/CommonLoading";
import CommunityRightbar from "../components/community/Rightbar";
import CommunityMainSection from "../components/community/MainSection";

const CommunityHome = () => {
  const navigate = useNavigate();
  const { communityName } = useParams();

  const { joinedCommunities } = useSelector((state) => state.community || {});
  const isAuthorized = joinedCommunities?.some(
    ({ name }) => name === communityName
  );

  useEffect(() => {
    if (!isAuthorized && joinedCommunities?.length > 0) {
      navigate("/access-denied");
    }
  }, [isAuthorized, joinedCommunities, navigate, communityName]);

  if (!joinedCommunities) {
    return (
      <div className="col-span-3 flex h-screen items-center justify-center">
        <CommonLoading />
      </div>
    );
  }

  return (
    <>
      <div className="main-section app-panel rounded-lg">
        <CommunityMainSection />
      </div>
      <div className="app-panel col-span-1 hidden h-[calc(100vh-7rem)] overflow-y-auto rounded-lg p-5 md:sticky md:top-24 md:block">
        <CommunityRightbar />
      </div>
    </>
  );
};

export default CommunityHome;
