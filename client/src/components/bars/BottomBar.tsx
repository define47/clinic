import { FC } from "react";
import { BottomBarItem } from "./BottomBarItem";
import {
  adminDashboardPathname,
  adminGuidePathname,
  appointmentsPathname,
  doctorsPathname,
  medicalProceduresPathname,
  medicalSpecialitiesPathname,
  nursesPathname,
  patientsPathname,
  receptionistsPathname,
  settingsPathname,
} from "../../utils/consts";
import { useLocation } from "react-router-dom";
import {
  MdOutlinePersonalInjury,
  MdOutlineSpaceDashboard,
  MdPersonalInjury,
  MdSpaceDashboard,
} from "react-icons/md";
import { GiBookmark, GiBookmarklet } from "react-icons/gi";
import {
  RiNurseFill,
  RiNurseLine,
  RiShieldCrossFill,
  RiShieldCrossLine,
  RiUserHeartFill,
  RiUserHeartLine,
} from "react-icons/ri";
import { BiInjection, BiSolidInjection } from "react-icons/bi";
import { FaRegUser, FaUser } from "react-icons/fa";
import { TbSettings, TbSettingsFilled } from "react-icons/tb";
import { IoHelpCircle, IoHelpCircleOutline } from "react-icons/io5";

export const BottomBar: FC = () => {
  const { pathname } = useLocation();
  return (
    <div className="fixed bottom-0 left-0 w-full h-20 bg-white border-t rounded-t-3xl">
      <ul className="flex overflow-x-auto">
        <BottomBarItem
          to={adminDashboardPathname}
          title="dashboard"
          icon={
            pathname === adminDashboardPathname ? (
              <MdSpaceDashboard />
            ) : (
              <MdOutlineSpaceDashboard />
            )
          }
          isActive={pathname === adminDashboardPathname}
        />
        <BottomBarItem
          to={appointmentsPathname}
          icon={
            pathname === appointmentsPathname ? (
              <GiBookmarklet />
            ) : (
              <GiBookmark />
            )
          }
          title="Appointments"
          isActive={pathname === appointmentsPathname}
        />
        <BottomBarItem
          to={patientsPathname}
          icon={
            pathname === patientsPathname ? (
              <MdPersonalInjury />
            ) : (
              <MdOutlinePersonalInjury />
            )
          }
          title="Patients"
          isActive={pathname === patientsPathname}
        />
        <BottomBarItem
          to={doctorsPathname}
          icon={
            pathname === doctorsPathname ? (
              <RiUserHeartFill />
            ) : (
              <RiUserHeartLine />
            )
          }
          title="Doctors"
          isActive={pathname === doctorsPathname}
        />
        <BottomBarItem
          to={medicalSpecialitiesPathname}
          icon={
            pathname === medicalSpecialitiesPathname ? (
              <RiShieldCrossFill />
            ) : (
              <RiShieldCrossLine />
            )
          }
          title="Medical Specialities"
          isActive={pathname === medicalSpecialitiesPathname}
        />
        <BottomBarItem
          to={medicalProceduresPathname}
          icon={
            pathname === medicalProceduresPathname ? (
              <BiSolidInjection />
            ) : (
              <BiInjection />
            )
          }
          title="Medical Procedures"
          isActive={pathname === medicalProceduresPathname}
        />
        <BottomBarItem
          to={nursesPathname}
          icon={pathname === nursesPathname ? <RiNurseFill /> : <RiNurseLine />}
          title="Nurses"
          isActive={pathname === nursesPathname}
        />
        <BottomBarItem
          to={receptionistsPathname}
          icon={pathname === receptionistsPathname ? <FaUser /> : <FaRegUser />}
          title="Receptionists"
          isActive={pathname === receptionistsPathname}
        />
        <BottomBarItem
          to={settingsPathname}
          icon={
            pathname === settingsPathname ? (
              <TbSettingsFilled />
            ) : (
              <TbSettings />
            )
          }
          title="Settings"
          isActive={pathname === settingsPathname}
        />
        <BottomBarItem
          to={adminGuidePathname}
          icon={
            pathname === adminGuidePathname ? (
              <IoHelpCircle />
            ) : (
              <IoHelpCircleOutline />
            )
          }
          title="Guide"
          isActive={pathname === adminGuidePathname}
        />
      </ul>
    </div>
  );
};
