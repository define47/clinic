import { FC, useContext, useEffect, useState } from "react";
import { StyledRippleButton } from "../../components/design/StyledRippleButton";
import { SocketNotificationDataContext } from "../../contexts/SocketNotificationContext";
import { phone } from "phone";

import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import { VirtualizedList } from "../../components/virt/VirtualizedList";
import { VirtualizedTable } from "../../components/virt/VirtualizedTable";
import { DragAndDrop } from "../../components/DragAndDrop";
import { AppointmentsTimetable } from "../../components/table/AppointmentsTimetable";
import WeekPicker from "../../components/pickers/WeekPicker";
import { MedicalProcedurePicker } from "../../components/pickers/MedicalProcedurePicker";
import { PhoneExtensionPicker } from "../../components/pickers/PhoneExtensionPicker";
import { GeneralDataCard } from "../../components/design/card/GeneralDataCard";
import { UserPicker } from "../../components/pickers/UserPicker";

export const AdminDashboard: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const socketContext = useContext(SocketNotificationDataContext);
  const { socketNotificationDataState, socketNotificationDataSetState } =
    socketContext!;

  const [selectedEntity, setSelectedEntity] = useState<string>("");

  const treeData = [
    {
      name: "Node 1",
      children: [
        {
          name: "Node 1.1",
          children: [{ name: "Node 1.1.1" }, { name: "Node 1.1.2" }],
        },
        { name: "Node 1.2" },
      ],
    },
    {
      name: "Node 2",
      children: [{ name: "Node 2.1" }, { name: "Node 2.2" }],
    },
  ];

  const columns = [
    { dataKey: "id", label: "ID" },
    { dataKey: "name", label: "Name" },
    // Add more columns as needed
  ];

  const data = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    name: `Name ${index + 1}`,
    // Add more properties as needed
  }));

  const rowHeight = 30;
  const containerHeight = 300;
  const columnWidth = 100;

  const items = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    content: `Item ${index + 1}`,
  }));

  // Item height and container height
  const itemHeight = 50;
  const [dashboardWeekStart, setDashboardWeekStart] = useState<string>("");
  const [dashboardWeekEnd, setDashboardWeekEnd] = useState<string>("");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  useEffect(() => {
    console.log("dashboard start end", dashboardWeekStart, dashboardWeekEnd);
  }, [dashboardWeekStart, dashboardWeekEnd]);

  useEffect(() => {
    console.log("phone", phone("+40751958454"));
  }, []);
  return (
    <div className="w-full h-full">
      {/* admin dashboard <Overlay /> */}
      {/* <MedicalProcedurePicker /> */}
      {/* <DragAndDrop /> */}
      <GeneralDataCard entity="admin" />
      {/* <PhoneExtensionPicker defaultPhoneExtension="+591" /> */}
      <div className="w-full h-full space-y-10">
        {/* {JSON.stringify(authenticatedUserDataState)} */}
        <div className="w-full flex flex-col items-center justify-center">
          <WeekPicker
            setDateWeekStart={setDashboardWeekStart}
            setDashboardWeekEnd={setDashboardWeekEnd}
            initialDate={new Date()}
          />
          <UserPicker
            shouldDataBeFetched={true}
            label="select doctor"
            roleName="doctor"
            selectedUserId={selectedDoctorId}
            setSelectedUserId={setSelectedDoctorId}
            selectedUserName={selectedDoctorName}
            setSelectedUserName={setSelectedDoctorName}
            z="z-50"
          />
        </div>
        {selectedDoctorId !== "" && (
          <div className="w-full h-4/5 overflow-y-auto border rounded-xl">
            <AppointmentsTimetable
              startWeek={dashboardWeekStart}
              endWeek={dashboardWeekEnd}
              doctorId={selectedDoctorId}
            />
          </div>
        )}
        {/* here notification {JSON.stringify(socketNotificationDataState)} */}
        {/* <StyledInput
          label="label1"
          textColorUnfocused="text-red-500"
          textColorFocused="focus:text-red-500"
          borderColorUnfocused="border-red-500"
          borderColorFocused="focus:border-red-500"
          labelUnfocused="text-red-500"
          labelFocused="text-red-500"
        />
        <StyledInput
          label="label2"
          textColorUnfocused="text-green-500"
          textColorFocused="focus:text-green-500"
          borderColorUnfocused="border-green-500"
          borderColorFocused="focus:border-green500"
          labelUnfocused="text-green-500"
          labelFocused="text-green-500"
        /> */}

        {/* <TreeTable /> */}
        {/* 
        <StyledRippleButton
          onClick={() => console.log("Button Clicked")}
          label="label"
          type="create"
        />
        <VirtualizedList
          items={items}
          itemHeight={itemHeight}
          containerHeight={containerHeight}
        />
        <VirtualizedTable
          data={data}
          columns={columns}
          rowHeight={rowHeight}
          containerHeight={containerHeight}
          columnWidth={columnWidth}
        /> */}

        {/* <DateTimePicker
          isDateOnly={false}
          label="DD/MM/YYYY HH:MM"
          selectedEntity={selectedEntity}
          setSelectedEntity={setSelectedEntity}
        /> */}
        {/* <UserPicker label="doctor picker" roleName="doctor" z="z-50" />
        <UserPicker label="patient picker" roleName="patient" z="z-40" /> */}
        {/* <LimitPicker /> */}
      </div>
      {/* <ConfirmationDialogEntry
        confirmationDialogEntryTitleWidth="w-10"
        confirmationDialogEntryTitle={"userForename"}
        confirmationDialogEntryBodyWidth="w-72"
        confirmationDialogEntryBody={"mihai tudor"}
      /> */}

      {/* <ConfirmationDialogEntry
        confirmationDialogEntryTitle={"userForename"}
        confirmationDialogEntryBody={
          "abc tudor tudor mihai tudor mihai tudor tudor tudor mihai tudor mihai tudor tudor tudor mihai tudor mihai tudor tudor tudor mihai tudor mihai tudortudor tudor mihai tudor mihai tudor tudor tudor mihai tudor mihai tudortudor tudor mihai tudor mihai tudor tudor tudor mihai tudor mihai tudor"
        }
      /> */}
    </div>
  );
};
