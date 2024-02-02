import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentHistory } from "../../types";
import { CardEntry } from "../../components/design/card/CardEntry";

export const AppointmentHistoryCards: FC = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointmentHistory, setAppointmentHistory] = useState<
    AppointmentHistory[]
  >([]);

  async function getAppointmentHistory() {
    try {
      const response = await axios.get(
        "http://192.168.2.16:40587/api/appointments-history",
        {
          params: {
            appointmentId,
          },
          withCredentials: true,
        }
      );

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
    <div className="h-full w-full flex items-start justify-start p-3">
      {/* <span
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </span> */}
      {/* hello {appointmentId} */}
      <div className="w-full h-full grid grid-cols-4 gap-5">
        {appointmentHistory.map(
          (appointmentHistoryCard: AppointmentHistory) => (
            <div
              key={
                appointmentHistoryCard.appointmentHistory.appointmentHistoryId
              }
            >
              <div className="h-96 border rounded-xl bg-white shadow-2xl shadow-black/40 text-xs">
                <div className="w-full flex flex-col">
                  <CardEntry
                    cardEntryTitle="Modified by"
                    cardEntryData={`${appointmentHistoryCard.modifier.appointmentHistoryUpdatedByForename}
                      ${appointmentHistoryCard.modifier.appointmentHistoryUpdatedBySurname}`}
                  />

                  <div className="p-3 w-full flex items-center justify-between border-b">
                    <span className="font-bold">Modified at</span>
                    <span>
                      {
                        appointmentHistoryCard.modifier
                          .appointmentHistoryUpdatedAt
                      }
                    </span>
                  </div>
                  <div className="p-3 w-full flex items-center justify-between border-b">
                    <span className="font-semibold">Status</span>
                    <span>
                      {
                        appointmentHistoryCard.appointmentHistory
                          .appointmentHistoryStatus
                      }
                    </span>
                  </div>
                  <div className="p-3 w-full flex items-center justify-between border-b">
                    <span className="font-semibold">Reason</span>
                    <span>
                      {
                        appointmentHistoryCard.appointmentHistory
                          .appointmentHistoryReason
                      }
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span>date time</span>
                    <span>
                      {
                        appointmentHistoryCard.appointmentHistory
                          .appointmentHistoryDateTime
                      }
                    </span>
                  </div>
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
