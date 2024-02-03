import { FC, useContext, useState } from "react";
import { StyledRippleButton } from "../../components/design/StyledRippleButton";
import { SocketNotificationDataContext } from "../../contexts/SocketNotificationContext";

import { UserSearchCriterionPicker } from "../../components/pickers/UserSearchCriterionPicker";
import { MedicalSpecialityPicker } from "../../components/pickers/MedicalSpecialityPicker";
import { TreeTable } from "../../components/TreeTable";
import { DateTimePicker } from "../../components/pickers/DateTimePicker";
import { UserPicker } from "../../components/pickers/UserPicker";
import { AppointmentSearchCriterionPicker } from "../../components/pickers/AppointmentSearchCriterionPicker";
import { LimitPicker } from "../../components/pickers/LimitPicker";

export const AdminDashboard: FC = () => {
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

  return (
    <div className="">
      {/* admin dashboard <Overlay /> */}
      <div className="space-y-10">
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
        <TreeTable />
        <StyledRippleButton
          onClick={() => console.log("Button Clicked")}
          label="label"
          type="create"
        />
        here notification {JSON.stringify(socketNotificationDataState)}
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
    </div>
  );
};
