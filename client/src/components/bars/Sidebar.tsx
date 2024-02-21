import { FC, useContext } from "react";
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
import {
  adminDashboardPathname,
  adminGuidePathname,
  appointmentsPathname,
  appointmentsPathnameForDoctors,
  appointmentsPathnameForReceptionists,
  doctorsPathname,
  medicalProceduresPathname,
  medicalSpecialitiesPathname,
  nursesPathname,
  patientsPathname,
  patientsPathnameForReceptionists,
  receptionistsDashboard,
  receptionistsPathname,
  settingsPathname,
} from "../../utils/consts";
import { logoutUserPath } from "../../utils/dotenv";
import IatropolisLogo from "../../assets/logo-iatropolis.png";
import { getItemByLanguageAndCollection } from "../../utils/clientLanguages";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";

export const Sidebar: FC<SidebarProps> = ({
  isSidebarExpanded,
  setIsSidebarExpanded,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;

  async function onLogout() {
    try {
      const response = await axios.post(
        logoutUserPath,
        {},
        { withCredentials: true }
      );
      navigate("/login");
      // navigate(0);
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
            <span
              className={`overflow-hidden transition-all flex items-center justify-center`}
            >
              <img
                src={IatropolisLogo}
                alt="Iatropolis, Botosani"
                className={`object-contain h-full w-full transition-all duration-500 ${
                  isSidebarExpanded ? "p-5" : "p-1"
                }`}
              />
            </span>
          </div>

          <ul className="flex-1 px-3">
            {(authenticatedUserDataState.roleNames[0] === "admin" ||
              authenticatedUserDataState.roleNames[1] === "admin") && (
              <SidebarItem
                to={adminDashboardPathname}
                icon={
                  pathname === adminDashboardPathname ? (
                    <MdSpaceDashboard />
                  ) : (
                    <MdOutlineSpaceDashboard />
                  )
                }
                title={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "sidebarMenuAdmin",
                  0
                )}
                active={pathname === adminDashboardPathname}
                isSidebarExpanded={isSidebarExpanded}
              />
            )}
            {authenticatedUserDataState.roleNames.length === 1 &&
              authenticatedUserDataState.roleNames[0] === "receptionist" && (
                <SidebarItem
                  to={receptionistsDashboard}
                  icon={
                    pathname === receptionistsDashboard ? (
                      <MdSpaceDashboard />
                    ) : (
                      <MdOutlineSpaceDashboard />
                    )
                  }
                  title={getItemByLanguageAndCollection(
                    authenticatedUserDataState.language.languageCode,
                    "sidebarMenuAdmin",
                    0
                  )}
                  active={pathname === receptionistsDashboard}
                  isSidebarExpanded={isSidebarExpanded}
                />
              )}
            {(authenticatedUserDataState.roleNames[0] === "admin" ||
              authenticatedUserDataState.roleNames[1] === "admin") && (
              <SidebarItem
                to={appointmentsPathname}
                icon={
                  pathname === appointmentsPathname ? (
                    <GiBookmarklet />
                  ) : (
                    <GiBookmark />
                  )
                }
                title={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "sidebarMenuAdmin",
                  1
                )}
                active={pathname === appointmentsPathname}
                isSidebarExpanded={isSidebarExpanded}
              />
            )}
            {authenticatedUserDataState.roleNames.length === 1 &&
              authenticatedUserDataState.roleNames[0] === "receptionist" && (
                <SidebarItem
                  to={appointmentsPathnameForReceptionists}
                  icon={
                    pathname === appointmentsPathnameForReceptionists ? (
                      <GiBookmarklet />
                    ) : (
                      <GiBookmark />
                    )
                  }
                  title={getItemByLanguageAndCollection(
                    authenticatedUserDataState.language.languageCode,
                    "sidebarMenuAdmin",
                    1
                  )}
                  active={pathname === appointmentsPathnameForReceptionists}
                  isSidebarExpanded={isSidebarExpanded}
                />
              )}
            {authenticatedUserDataState.roleNames.length === 1 &&
              authenticatedUserDataState.roleNames[0] === "doctor" && (
                <SidebarItem
                  to={appointmentsPathnameForDoctors}
                  icon={
                    pathname === appointmentsPathnameForDoctors ? (
                      <GiBookmarklet />
                    ) : (
                      <GiBookmark />
                    )
                  }
                  title={getItemByLanguageAndCollection(
                    authenticatedUserDataState.language.languageCode,
                    "sidebarMenuAdmin",
                    1
                  )}
                  active={pathname === appointmentsPathnameForDoctors}
                  isSidebarExpanded={isSidebarExpanded}
                />
              )}
            {(authenticatedUserDataState.roleNames[0] === "admin" ||
              authenticatedUserDataState.roleNames[1] === "admin") && (
              <SidebarItem
                to={patientsPathname}
                icon={
                  pathname === patientsPathname ? (
                    <MdPersonalInjury />
                  ) : (
                    <MdOutlinePersonalInjury />
                  )
                }
                title={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "sidebarMenuAdmin",
                  2
                )}
                active={pathname === patientsPathname}
                isSidebarExpanded={isSidebarExpanded}
              />
            )}

            {authenticatedUserDataState.roleNames.length === 1 &&
              authenticatedUserDataState.roleNames[0] === "receptionist" && (
                <SidebarItem
                  to={patientsPathnameForReceptionists}
                  icon={
                    pathname === patientsPathnameForReceptionists ? (
                      <MdPersonalInjury />
                    ) : (
                      <MdOutlinePersonalInjury />
                    )
                  }
                  title={getItemByLanguageAndCollection(
                    authenticatedUserDataState.language.languageCode,
                    "sidebarMenuAdmin",
                    2
                  )}
                  active={pathname === patientsPathnameForReceptionists}
                  isSidebarExpanded={isSidebarExpanded}
                />
              )}
            {(authenticatedUserDataState.roleNames[0] === "admin" ||
              authenticatedUserDataState?.roleNames[1] === "admin") && (
              <SidebarItem
                to={doctorsPathname}
                icon={
                  pathname === doctorsPathname ? (
                    <RiUserHeartFill />
                  ) : (
                    <RiUserHeartLine />
                  )
                }
                title={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "sidebarMenuAdmin",
                  3
                )}
                active={pathname === doctorsPathname}
                isSidebarExpanded={isSidebarExpanded}
              />
            )}
            {(authenticatedUserDataState.roleNames[0] === "admin" ||
              authenticatedUserDataState?.roleNames[1] === "admin") && (
              <SidebarItem
                to={medicalSpecialitiesPathname}
                icon={
                  pathname === medicalSpecialitiesPathname ? (
                    <RiShieldCrossFill />
                  ) : (
                    <RiShieldCrossLine />
                  )
                }
                title={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "sidebarMenuAdmin",
                  4
                )}
                active={pathname === medicalSpecialitiesPathname}
                isSidebarExpanded={isSidebarExpanded}
              />
            )}
            {(authenticatedUserDataState.roleNames[0] === "admin" ||
              authenticatedUserDataState?.roleNames[1] === "admin") && (
              <SidebarItem
                to={medicalProceduresPathname}
                icon={
                  pathname === medicalProceduresPathname ? (
                    <BiSolidInjection />
                  ) : (
                    <BiInjection />
                  )
                }
                title={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "sidebarMenuAdmin",
                  5
                )}
                active={pathname === medicalProceduresPathname}
                isSidebarExpanded={isSidebarExpanded}
              />
            )}
            {(authenticatedUserDataState.roleNames[0] === "admin" ||
              authenticatedUserDataState?.roleNames[1] === "admin") && (
              <SidebarItem
                to={nursesPathname}
                icon={
                  pathname === nursesPathname ? (
                    <RiNurseFill />
                  ) : (
                    <RiNurseLine />
                  )
                }
                title={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "sidebarMenuAdmin",
                  6
                )}
                active={pathname === nursesPathname}
                isSidebarExpanded={isSidebarExpanded}
              />
            )}
            {(authenticatedUserDataState.roleNames[0] === "admin" ||
              authenticatedUserDataState?.roleNames[1] === "admin") && (
              <SidebarItem
                to={receptionistsPathname}
                icon={
                  pathname === receptionistsPathname ? (
                    <FaUser />
                  ) : (
                    <FaRegUser />
                  )
                }
                title={getItemByLanguageAndCollection(
                  authenticatedUserDataState.language.languageCode,
                  "sidebarMenuAdmin",
                  7
                )}
                active={pathname === receptionistsPathname}
                isSidebarExpanded={isSidebarExpanded}
              />
            )}
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
              title={getItemByLanguageAndCollection(
                authenticatedUserDataState.language.languageCode,
                "sidebarMenuAdmin",
                8
              )}
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
              title={getItemByLanguageAndCollection(
                authenticatedUserDataState.language.languageCode,
                "sidebarMenuAdmin",
                9
              )}
              active={pathname === adminGuidePathname}
              isSidebarExpanded={isSidebarExpanded}
            />
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
