import { ExtendedCandidate } from "@shared-types/ExtendedCandidate";
import ax from "./axios";

const useCandidate = (getToken?: any): ExtendedCandidate | null => {
  const axios = ax(getToken);
  axios
    .get("/candidates")
    .then((res) => {
      return res.data.data as ExtendedCandidate;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return null;
};

export default useCandidate;
