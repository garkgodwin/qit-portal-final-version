import { useSelector } from "react-redux";
import "./Loading.css";

const ScreenLoading = () => {
  const loading = useSelector((state) => state.loading);
  const page = useSelector((state) => state.page);

  const lt = "...Loading...";

  return (
    <div
      className={
        "Loading" + (loading.shown || page.loading ? " loading-shown" : "")
      }
    >
      <h4 className="loading-text">{lt}</h4>
    </div>
  );
};

export default ScreenLoading;
