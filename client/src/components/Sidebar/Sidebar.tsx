import { FC, useEffect } from "react";
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

export const Sidebar: FC<SidebarProps> = ({
  isSidebarExpanded,
  setIsSidebarExpanded,
}) => {
  const { pathname } = useLocation();
  const appointmentsPathname = "/admins/appointments";
  const adminDashboardPathname = "/admins/dashboard";
  const patientsPathname = "/admins/patients";
  const doctorsPathname = "/admins/doctors";
  const specialitiesPathname = "/admins/specialities";
  const nursesPathname = "/admins/nurses";
  const receptionistsPathname = "/admins/receptionists";

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <aside
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
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center border-b">
          {/* <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              isSidebarExpanded ? "w-32" : "w-32"
            }`}
            alt=""
          /> */}
          <span
            className={`overflow-hidden transition-all  ${
              isSidebarExpanded ? "w-32" : "w-32 text-xs"
            }`}
          >
            Iatropolis
          </span>

          {/* fixed ${
              isSidebarExpanded ? "left-60 top-16" : "left-[70px] top-7"
            }  */}
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`${
              !isSidebarExpanded && "flex w-full items-center justify-center"
            } rounded-lg bg-gray-50 hover:bg-gray-100`}
          >
            {isSidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
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
            to={specialitiesPathname}
            icon={
              pathname === specialitiesPathname ? (
                <RiShieldCrossFill />
              ) : (
                <RiShieldCrossLine />
              )
            }
            title="Specialities"
            active={pathname === specialitiesPathname}
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
        </ul>
      </nav>
    </aside>
  );
};
