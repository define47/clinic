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
import { StyledInputV2 } from "../../components/design/StyledInputV2";
import { RiCalendarFill } from "react-icons/ri";
import { StyledAppointmentStatusName } from "../../components/design/StyledAppointmentStatusName";
import { DoctorsByMedicalSpecialityChart } from "../../components/dataVisualisation/DoctorsByMedicalSpecialityChart";
import { AppointmentAreaChart } from "../../components/dataVisualisation/AppointmentAreaChart";

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
      <div
        className={`w-full ${selectedDoctorId !== "" && "h-full"} space-y-10`}
      >
        {JSON.stringify(authenticatedUserDataState)}
        <div className="w-full flex flex-col items-center justify-center">
          <WeekPicker
            setDateWeekStart={setDashboardWeekStart}
            setDashboardWeekEnd={setDashboardWeekEnd}
            initialDate={new Date()}
          />
          <div className="w-72">
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
      <div className="w-full grid grid-cols-4 gap-3">
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Admins"
            entity="admin"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Doctors"
            entity="doctor"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Patients"
            entity="patient"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Receptionists"
            entity="receptionist"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Appointments Today"
            entity="appointment"
            period="today"
            choice="getTotalNumberOfAppointmentsPerPeriod"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Appointments Week"
            entity="appointment"
            period="week"
            choice="getTotalNumberOfAppointmentsPerPeriod"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Appointments Next Week"
            entity="appointment"
            period="nextWeek"
            choice="getTotalNumberOfAppointmentsPerPeriod"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Appointments Month"
            entity="appointment"
            period="month"
            choice="getTotalNumberOfAppointmentsPerPeriod"
          />
        </div>

        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Doctors With Appointments Today"
            entity="appointment"
            period="today"
            choice="getTotalNumberOfDoctorsPerPeriodWithAppointments"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Doctors With Appointments Week"
            entity="appointment"
            period="week"
            choice="getTotalNumberOfDoctorsPerPeriodWithAppointments"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Doctors With Appointments Next Week"
            entity="appointment"
            period="nextWeek"
            choice="getTotalNumberOfDoctorsPerPeriodWithAppointments"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Doctors With Appointments Month"
            entity="appointment"
            period="month"
            choice="getTotalNumberOfDoctorsPerPeriodWithAppointments"
          />
        </div>

        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Patients With Appointments Today"
            entity="appointment"
            period="today"
            choice="getTotalNumberOfPatientsPerPeriodWithAppointments"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Patients With Appointments Week"
            entity="appointment"
            period="week"
            choice="getTotalNumberOfPatientsPerPeriodWithAppointments"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Patients With Appointments Next Week"
            entity="appointment"
            period="nextWeek"
            choice="getTotalNumberOfPatientsPerPeriodWithAppointments"
          />
        </div>
        <div className="col-span-4 lg:col-span-1">
          <GeneralDataCard
            generalDataCardTitle="Total Number Of Patients With Appointments Month"
            entity="appointment"
            period="month"
            choice="getTotalNumberOfPatientsPerPeriodWithAppointments"
          />
        </div>
      </div>
      <DoctorsByMedicalSpecialityChart />
      <AppointmentAreaChart />
      {/* <PhoneExtensionPicker defaultPhoneExtension="+40" />
      <StyledAppointmentStatusName appointmentStatusName="completed" />
      <StyledAppointmentStatusName appointmentStatusName="canceled" /> */}
      {/* admin dashboard <Overlay /> */}
      {/* <MedicalProcedurePicker /> */}
      {/* <DragAndDrop /> */}

      {/* <StyledInputV2
        unfocusedTextColor="text-red-600"
        unfocusedBorderColor="border-red-600"
        focusedTextColor="focus:text-blue-300"
        focusedBorderColor="focus:border-blue-300"
        unfocusedLabelColor="text-red-600"
        unfocusedLabelBackgroundColor="bg-white"
        focusedLabelColor="text-blue-300"
        focusedLabelBackgroundColor="bg-gray-100"
        onClickIcon={() => console.log("hello icon")}
        isDisabled={false}
        label={`Criteria`}
        name={`Criteria`}
        onChangeStyledInput={(event) => {}}
        styledInputValue={""}
        styledInputWidth="w-full"
      /> */}
      {/* <GeneralDataCard entity="admin" /> */}
      {/* <PhoneExtensionPicker defaultPhoneExtension="+591" /> */}

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
