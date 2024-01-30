import { FC, useContext, useState } from "react";
import { StyledRippleButton } from "../../components/design/StyledRippleButton";
import { SocketNotificationDataContext } from "../../contexts/SocketNotificationContext";

import { UserSearchCriterionPicker } from "../../components/pickers/UserSearchCriterionPicker";
import { MedicalSpecialityPicker } from "../../components/pickers/MedicalSpecialityPicker";
import { TreeTable } from "../../components/TreeTable";
import { DateTimePicker } from "../../components/pickers/DateTimePicker";
import { UserPicker } from "../../components/pickers/UserPicker";

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
        <DateTimePicker
          isDateOnly={false}
          label="DD/MM/YYYY HH:MM"
          selectedEntity={selectedEntity}
          setSelectedEntity={setSelectedEntity}
        />
        {/* <UserSearchCriterionPicker /> */}
        {/* <div className="flex">
          <DateTimePicker isDateOnly={true} label="date picker" />
          <DateTimePicker isDateOnly={false} label="date time picker" />
          <DateTimePicker
            isDateOnly={true}
            label="DEFAULT date picker"
            defaultDate="1234-08-23"
          />
          <DateTimePicker
            isDateOnly={false}
            label="DEFAULT date time picker"
            defaultDate="2025-03-05"
            defaultTime="10:00"
          />
        </div> */}
        <UserPicker label="doctor picker" roleName="doctor" />
        <UserPicker label="patient picker" roleName="patient" />
      </div>
    </div>
  );
};
