import { FC, useContext } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const DoctorDashboard: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const navigate = useNavigate();

  async function onLogout() {
    try {
      const response = await axios.post(
        "http://192.168.2.16:40587/api/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      Doctor Dashboard: {JSON.stringify(authenticatedUserDataState)}{" "}
      <div className="flex items-center" onClick={onLogout}>
        <CiLogout className="text-xl" />
        <span>Logout</span>
      </div>
    </div>
  );
};
