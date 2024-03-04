import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentHistory } from "../../types";
import { CardEntry } from "../../components/design/card/CardEntry";
import { VscDash } from "react-icons/vsc";
import { IoArrowUndoOutline } from "react-icons/io5";
import { appointmentHistoryAPIPath } from "../../utils/dotenv";

export const AppointmentHistoryCards: FC = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointmentHistory, setAppointmentHistory] = useState<
    AppointmentHistory[]
  >([]);

  async function getAppointmentHistory() {
    try {
      const response = await axios.get(appointmentHistoryAPIPath, {
        params: {
          appointmentId,
        },
        withCredentials: true,
      });

      // console.log(response.data);
      if (response.data.success) setAppointmentHistory(response.data.payload);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAppointmentHistory();
  }, [appointmentId]);

  useEffect(() => {
    console.log(appointmentHistory);
  }, [appointmentHistory]);

  return (
    <div className="h-full w-full">
      <IoArrowUndoOutline
        className="text-3xl hover:text-pink-300 hover:scale-125 mb-3"
        onClick={() => {
          navigate(-1);
        }}
      />

      {/* hello {appointmentId} */}
      <div className="grid grid-cols-4 gap-6">
        {appointmentHistory.map(
          (
            appointmentHistoryCard: AppointmentHistory,
            appointmentHistoryCardIndex: number
          ) => (
            <div
              key={
                appointmentHistoryCard.appointmentHistory.appointmentHistoryId
              }
            >
              <div className="h-auto border border-lightMode-borderColor dark:border-darkMode-borderColor rounded-xl bg-white dark:bg-darkMode-itemBackgroundColor shadow-2xl shadow-black/40 text-xs dark:text-gray-400">
                <div className="w-full flex flex-col">
                  {appointmentHistoryCardIndex === 0 && (
                    <>
                      <CardEntry
                        cardEntryTitle="Created by"
                        cardEntryData={`${appointmentHistoryCard.creator.appointmentHistoryCreatedByForename}
                      ${appointmentHistoryCard.creator.appointmentHistoryCreatedBySurname}`}
                      />

                      <CardEntry
                        cardEntryTitle="Created at"
                        cardEntryData={`${appointmentHistoryCard.creator.appointmentHistoryCreatedAt
                          .split("T")[1]
                          .substring(
                            0,
                            5
                          )} ${appointmentHistoryCard.creator.appointmentHistoryCreatedAt
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}`}
                      />
                    </>
                  )}

                  {appointmentHistoryCardIndex > 0 && (
                    <>
                      <CardEntry
                        cardEntryTitle="Modified by"
                        cardEntryData={`${appointmentHistoryCard.modifier.appointmentHistoryUpdatedByForename}
                      ${appointmentHistoryCard.modifier.appointmentHistoryUpdatedBySurname}`}
                      />

                      <CardEntry
                        cardEntryTitle="Modified at"
                        cardEntryData={`${appointmentHistoryCard.modifier.appointmentHistoryUpdatedAt
                          .split("T")[1]
                          .substring(
                            0,
                            5
                          )} ${appointmentHistoryCard.modifier.appointmentHistoryUpdatedAt
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}`}
                      />
                    </>
                  )}

                  <CardEntry
                    cardEntryTitle="Doctor"
                    cardEntryData={`${appointmentHistoryCard.doctor.doctorForename} ${appointmentHistoryCard.doctor.doctorSurname}`}
                  />

                  <CardEntry
                    cardEntryTitle="Patient"
                    cardEntryData={`${appointmentHistoryCard.patient.patientForename} ${appointmentHistoryCard.patient.patientSurname}`}
                  />

                  <CardEntry
                    cardEntryTitle="Status"
                    cardEntryData={`${appointmentHistoryCard.appointmentHistory.appointmentHistoryStatus}`}
                    cardEntryType="appointmentStatus"
                  />

                  <CardEntry
                    cardEntryTitle="Reason"
                    cardEntryData={`${appointmentHistoryCard.appointmentHistory.appointmentHistoryReason}`}
                  />

                  <CardEntry
                    cardEntryTitle="Date Time"
                    cardEntryData={`${appointmentHistoryCard.appointmentHistory.appointmentHistoryDateTime
                      .split("T")[1]
                      .substring(
                        0,
                        5
                      )} ${appointmentHistoryCard.appointmentHistory.appointmentHistoryDateTime
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}`}
                  />

                  <CardEntry
                    cardEntryTitle="Cancellation Reason"
                    cardEntryData={`${appointmentHistoryCard.appointmentHistory.appointmentHistoryCancellationReason}`}
                  />
                </div>
              </div>
              {/* {
                appointmentHistoryCard.modifier
                  .appointmentHistoryUpdatedByForename
              }
              {
                appointmentHistoryCard.modifier
                  .appointmentHistoryUpdatedBySurname
              } */}
            </div>
          )
        )}
      </div>
    </div>
  );
};
