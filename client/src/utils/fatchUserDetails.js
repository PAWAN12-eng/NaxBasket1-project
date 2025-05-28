import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fatchUserDetails = async () => {
  try {
    const response = await Axios({
        ...SummaryApi.userDetails
    }); 
    return response.data
  } catch (error) {
    console.error("Error while fetching user details:", error.message);
  }
};

export default fatchUserDetails;
