// src/pages/LiveWeightWrapper.jsx
import { useParams } from "react-router-dom";
import LiveWeightPage from "./LiveWeightPage";

const LiveWeightWrapper = () => {
  const { scaleId } = useParams();
  return <LiveWeightPage scaleId={scaleId} />;
};

export default LiveWeightWrapper;
