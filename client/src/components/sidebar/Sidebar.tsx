import { FC } from "react";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { SidebarProps } from "../../types";
import {
  MdOutlinePersonalInjury,
  MdOutlineSpaceDashboard,
  MdPersonalInjury,
  MdSpaceDashboard,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { GiBookmark, GiBookmarklet } from "react-icons/gi";
import {
  RiNurseFill,
  RiNurseLine,
  RiShieldCrossFill,
  RiShieldCrossLine,
  RiUserHeartFill,
  RiUserHeartLine,
} from "react-icons/ri";
import { FaRegUser, FaUser } from "react-icons/fa";
import { TbSettings, TbSettingsFilled } from "react-icons/tb";
import { IoHelpCircle, IoHelpCircleOutline } from "react-icons/io5";
import { BiInjection, BiSolidInjection } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import axios from "axios";

export const Sidebar: FC<SidebarProps> = ({
  isSidebarExpanded,
  setIsSidebarExpanded,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const appointmentsPathname = "/admins/appointments";
  const adminDashboardPathname = "/admins/dashboard";
  const patientsPathname = "/admins/patients";
  const doctorsPathname = "/admins/doctors";
  const medicalSpecialitiesPathname = "/admins/medical-specialities";
  const medicalProceduresPathname = "/admins/medical-procedures";
  const nursesPathname = "/admins/nurses";
  const receptionistsPathname = "/admins/receptionists";
  const settingsPathname = "/admins/settings";
  const adminGuidePathname = "/admins/guide";

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
    <>
      <div
        className={`transition-all ${
          // fixed top-0 left-20 w-full h-full bg-black opacity-0 z-0 ease-out duration-200
          isSidebarExpanded
            ? "fixed top-0 left-64 w-full h-full bg-black opacity-50 z-0 ease-in duration-200"
            : ""
        } `}
        onClick={() => setIsSidebarExpanded(false)}
      ></div>

      <aside
        // fixed top-0 left-0 z-20
        className={`h-full overflow-hidden transition-all ${
          isSidebarExpanded ? "w-64 " : "w-20"
        }`}
        onMouseEnter={() => {
          setIsSidebarExpanded(true);
        }}
        onMouseLeave={() => {
          setIsSidebarExpanded(false);
        }}
      >
        <nav className="h-full flex flex-col bg-lightMode-sidebarColor dark:bg-darkMode-sidebarColor border-r shadow-sm">
          <div className="h-14 flex justify-between items-center border-b">
            {/* <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              isSidebarExpanded ? "w-32" : "w-32"
            }`}
            alt=""
          /> */}
            <span
              className={`overflow-hidden transition-all flex items-center justify-center  ${
                isSidebarExpanded ? "w-full text-2xl" : "w-full text-sm"
              }`}
            >
              Iatropolis
            </span>

            {/* fixed ${
              isSidebarExpanded ? "left-60 top-16" : "left-[70px] top-7"
            }  */}
            {/* <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`${
              !isSidebarExpanded && "flex w-full items-center justify-center"
            } rounded-lg bg-gray-50 hover:bg-gray-100`}
          >
            {isSidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
          </button> */}
          </div>

          <ul className="flex-1 px-3">
            <SidebarItem
              to={adminDashboardPathname}
              icon={
                pathname === adminDashboardPathname ? (
                  <MdSpaceDashboard />
                ) : (
                  <MdOutlineSpaceDashboard />
                )
              }
              title="Dashboard"
              active={pathname === adminDashboardPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <SidebarItem
              to={appointmentsPathname}
              icon={
                pathname === appointmentsPathname ? (
                  <GiBookmarklet />
                ) : (
                  <GiBookmark />
                )
              }
              title="Appointments"
              active={pathname === appointmentsPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <SidebarItem
              to={patientsPathname}
              icon={
                pathname === patientsPathname ? (
                  <MdPersonalInjury />
                ) : (
                  <MdOutlinePersonalInjury />
                )
              }
              title="Patients"
              active={pathname === patientsPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <SidebarItem
              to={doctorsPathname}
              icon={
                pathname === doctorsPathname ? (
                  <RiUserHeartFill />
                ) : (
                  <RiUserHeartLine />
                )
              }
              title="Doctors"
              active={pathname === doctorsPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <SidebarItem
              to={medicalSpecialitiesPathname}
              icon={
                pathname === medicalSpecialitiesPathname ? (
                  <RiShieldCrossFill />
                ) : (
                  <RiShieldCrossLine />
                )
              }
              title="Medical Specialities"
              active={pathname === medicalSpecialitiesPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <SidebarItem
              to={medicalProceduresPathname}
              icon={
                pathname === medicalProceduresPathname ? (
                  <BiSolidInjection />
                ) : (
                  <BiInjection />
                )
              }
              title="Medical Procedures"
              active={pathname === medicalProceduresPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <SidebarItem
              to={nursesPathname}
              icon={
                pathname === nursesPathname ? <RiNurseFill /> : <RiNurseLine />
              }
              title="Nurses"
              active={pathname === nursesPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <SidebarItem
              to={receptionistsPathname}
              icon={
                pathname === receptionistsPathname ? <FaUser /> : <FaRegUser />
              }
              title="Receptionists"
              active={pathname === receptionistsPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <li className="border-b"></li>
            <SidebarItem
              to={settingsPathname}
              icon={
                pathname === settingsPathname ? (
                  <TbSettingsFilled />
                ) : (
                  <TbSettings />
                )
              }
              title="Settings"
              active={pathname === settingsPathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            <SidebarItem
              to={adminGuidePathname}
              icon={
                pathname === adminGuidePathname ? (
                  <IoHelpCircle />
                ) : (
                  <IoHelpCircleOutline />
                )
              }
              title="Guide"
              active={pathname === adminGuidePathname}
              isSidebarExpanded={isSidebarExpanded}
            />
            {/* <SidebarItem
              to={"/login"}
              icon={<CiLogout onClick={onLogout} />}
              title="Logout"
              active={pathname === adminGuidePathname}
              isSidebarExpanded={isSidebarExpanded}
            /> */}
          </ul>
          {/* <span onClick={onLogout}>logout</span> */}
          <div className="flex items-center" onClick={onLogout}>
            <CiLogout className="text-xl" />
            <span>Logout</span>
          </div>
        </nav>
      </aside>
    </>
  );
};
