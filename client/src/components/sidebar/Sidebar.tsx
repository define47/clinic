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
import { useLocation } from "react-router-dom";
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

export const Sidebar: FC<SidebarProps> = ({
  isSidebarExpanded,
  setIsSidebarExpanded,
}) => {
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

  return (
    <aside
      // fixed top-0 left-0 z-20
      className={`h-full overflow-hidden transition-all ${
        isSidebarExpanded ? "w-64" : "w-20"
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
        </ul>
      </nav>
    </aside>
  );
};
