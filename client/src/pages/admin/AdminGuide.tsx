import { FC } from "react";
import { DailyAppointmentsTablePrinter } from "../../components/printing/DailyAppointmentsTablePrinter";

export const AdminGuide: FC = () => {
  return (
    <div>
      {/* Admin Guide <RichTextEditor /> */}
      <DailyAppointmentsTablePrinter />
    </div>
  );
};
