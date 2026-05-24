import { PulseLoader } from "react-spinners";

const FallbackLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-background dark:bg-background-dark">
      <PulseLoader color="#00bcd4" />
    </div>
  );
};

export default FallbackLoading;
