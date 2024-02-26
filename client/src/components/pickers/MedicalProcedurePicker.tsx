import { FC, useContext, useEffect, useState } from "react";
import { AuthenticatedUserDataContext } from "../../contexts/UserContext";
import axios from "axios";
import { Group, MedicalProcedure, MedicalSpeciality } from "../../types";
import { medicalProceduresAPI } from "../../utils/dotenv";
import { VscDash } from "react-icons/vsc";

export const MedicalProcedurePicker: FC = () => {
  const authContext = useContext(AuthenticatedUserDataContext);
  const { authenticatedUserDataState, authenticatedUserDataSetState } =
    authContext!;
  const [groups, setGroups] = useState<Group[]>([]);
  const [medicalProcedures, setMedicalProcedures] = useState<any>([]);
  const [dragData, setDragData] = useState<any>({
    groupId: "",
    originalGroupId: "",
    medicalProcedureId: "",
    medicalProcedureName: "",
    medicalProcedurePrice: -1,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    // setAuthenticatedUserMedicalSpecialities((prevMedicalSpecialities) => ({
    //   ...prevMedicalSpecialities,
    //   medicalSpecialityId:
    //     authenticatedUserDataState?.medicalSpecialities![0].medicalSpecialityId,
    //   medicalSpecialityName:
    //     authenticatedUserDataState?.medicalSpecialities![0]
    //       .medicalSpecialityName,
    // }));

    // setAuthenticatedUserMedicalSpecialities([
    //   {
    // medicalSpecialityId:
    //   authenticatedUserDataState?.medicalSpecialities![0]
    //     .medicalSpecialityId,
    // medicalSpecialityName:
    //   authenticatedUserDataState?.medicalSpecialities![0]
    //     .medicalSpecialityName,
    //   },
    // ]);

    setGroups((current) => [
      ...current,
      {
        groupId:
          authenticatedUserDataState?.medicalSpecialities![0]
            .medicalSpecialityId,
        groupName:
          authenticatedUserDataState?.medicalSpecialities![0]
            .medicalSpecialityName,
      },
    ]);

    authenticatedUserDataState?.medicalSpecialities![1] &&
      setGroups((current) => [
        ...current,
        {
          groupId:
            authenticatedUserDataState?.medicalSpecialities![1]
              .medicalSpecialityId,
          groupName:
            authenticatedUserDataState?.medicalSpecialities![1]
              .medicalSpecialityName,
        },
      ]);

    authenticatedUserDataState?.medicalSpecialities![2] &&
      setGroups((current) => [
        ...current,
        {
          groupId:
            authenticatedUserDataState?.medicalSpecialities![2]
              .medicalSpecialityId,
          groupName:
            authenticatedUserDataState?.medicalSpecialities![2]
              .medicalSpecialityName,
        },
      ]);

    setGroups((current) => [
      ...current,
      {
        groupId: "123456",
        groupName: "Conducted Tests",
      },
    ]);
  }, []);

  async function getMedicalProceduresBySpeciality() {
    try {
      //   for (let i = 0; i < groups.length; i++) {
      //     console.log(groups[i].groupId);

      //     const response = await axios.get(medicalProceduresPath, {
      //       params: {
      //         medicalSpecialityId:
      //           groups[i].groupId !== "123456" && groups[i].groupId,
      //         searchQuery: "",
      //         limit: 999999,
      //         page: 0,
      //         orderBy: "asc:medicalProcedureName",
      //       },
      //       withCredentials: true,
      //     });

      //     console.log("gothere", response);

      //     if (response.data.success) {
      //       const tableData = response.data.payload.tableData;
      //       for (let i = 0; i < tableData.length; i++) {
      //         setMedicalProcedures((current) => [
      //           ...current,
      //           {
      //             groupId: groups[i]?.groupId,
      //             medicalProcedureId: tableData[i].medicalProcedureId,
      //             medicalProcedureName: tableData[i].medicalProcedureName,
      //             medicalProcedurePrice: tableData[i].medicalProcedurePrice,
      //           },
      //         ]);
      //       }
      //     }
      //   }

      const response = await axios.get(medicalProceduresAPI, {
        params: {
          medicalSpecialityId:
            authenticatedUserDataState?.medicalSpecialities![0]
              .medicalSpecialityId,
          searchQuery: "",
          limit: 999999,
          page: 0,
          orderBy: "asc:medicalProcedureName",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const tableData = response.data.payload.tableData;
        for (let i = 0; i < tableData.length; i++) {
          setMedicalProcedures((current) => [
            ...current,
            {
              groupId:
                authenticatedUserDataState?.medicalSpecialities![0]
                  .medicalSpecialityId,
              originalGroupId:
                authenticatedUserDataState?.medicalSpecialities![0]
                  .medicalSpecialityId,
              medicalProcedureId: tableData[i].medicalProcedureId,
              medicalProcedureName: tableData[i].medicalProcedureName,
              medicalProcedurePrice: tableData[i].medicalProcedurePrice,
            },
          ]);
        }
      }

      // //////

      const response1 = await axios.get(medicalProceduresAPI, {
        params: {
          medicalSpecialityId:
            authenticatedUserDataState?.medicalSpecialities![1]
              .medicalSpecialityId,
          originalGroupId:
            authenticatedUserDataState?.medicalSpecialities![1]
              .medicalSpecialityId,
          searchQuery: "",
          limit: 999999,
          page: 0,
          orderBy: "asc:medicalProcedureName",
        },
        withCredentials: true,
      });

      if (response1.data.success) {
        const tableData = response1.data.payload.tableData;
        for (let i = 0; i < tableData.length; i++) {
          setMedicalProcedures((current) => [
            ...current,
            {
              groupId:
                authenticatedUserDataState?.medicalSpecialities![1]
                  .medicalSpecialityId,
              originalGroupId:
                authenticatedUserDataState?.medicalSpecialities![1]
                  .medicalSpecialityId,
              medicalProcedureId: tableData[i].medicalProcedureId,
              medicalProcedureName: tableData[i].medicalProcedureName,
              medicalProcedurePrice: tableData[i].medicalProcedurePrice,
            },
          ]);
        }
      }

      const response2 = await axios.get(medicalProceduresAPI, {
        params: {
          medicalSpecialityId:
            authenticatedUserDataState?.medicalSpecialities![2]
              .medicalSpecialityId,
          searchQuery: "",
          limit: 999999,
          page: 0,
          orderBy: "asc:medicalProcedureName",
        },
        withCredentials: true,
      });

      if (response2.data.success) {
        const tableData = response2.data.payload.tableData;
        for (let i = 0; i < tableData.length; i++) {
          setMedicalProcedures((current) => [
            ...current,
            {
              groupId:
                authenticatedUserDataState?.medicalSpecialities![2]
                  .medicalSpecialityId,
              originalGroupId:
                authenticatedUserDataState?.medicalSpecialities![2]
                  .medicalSpecialityId,
              medicalProcedureId: tableData[i].medicalProcedureId,
              medicalProcedureName: tableData[i].medicalProcedureName,
              medicalProcedurePrice: tableData[i].medicalProcedurePrice,
            },
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMedicalProceduresBySpeciality();
  }, []);

  useEffect(() => {
    console.log("authenticatedUserMedicalSpecialities", groups);
  }, [groups]);

  useEffect(() => {
    console.log("medicalProcedures", medicalProcedures);
  }, [medicalProcedures]);

  function handleDragStart(
    e,
    medicalProcedure: MedicalProcedure,
    group: Group
  ) {
    setDragData({
      groupId: group.groupId,
      originalGroupId: medicalProcedure.groupId,
      ...medicalProcedure,
    });
    setIsDragging(true);
  }

  const handleDragEnter = (e, group: Group) => {};

  const handleDragLeave = (e) => {};

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  function changeGroup(
    medicalProcedureId: string,
    originalGroupId: string,
    groupId: string
  ) {
    if (groupId === "123456") {
      setMedicalProcedures((prevMedicalProcedures: any) => {
        const updatedMedicalProcedures = prevMedicalProcedures.map(
          (prevMedicalProcedure: any) => {
            if (
              prevMedicalProcedure.medicalProcedureId === medicalProcedureId
            ) {
              return {
                // ...medicalProcedure,
                groupId,
                originalGroupId,
                medicalProcedureId: prevMedicalProcedure.medicalProcedureId,
                medicalProcedureName: prevMedicalProcedure.medicalProcedureName,
                medicalProcedurePrice:
                  prevMedicalProcedure.medicalProcedurePrice,
              };
            } else {
              return prevMedicalProcedure;
            }
          }
        );
        return updatedMedicalProcedures;
      });
    } else if (originalGroupId === dragData.originalGroupId) {
      // Move the item back to its original group
      setMedicalProcedures((prevMedicalProcedures: any) => {
        const updatedMedicalProcedures = prevMedicalProcedures.map(
          (prevMedicalProcedure: any) => {
            if (
              prevMedicalProcedure.medicalProcedureId === medicalProcedureId
            ) {
              return {
                // ...medicalProcedure,
                groupId: dragData.originalGroupId,
                originalGroupId: dragData.originalGroupId,
                medicalProcedureId: prevMedicalProcedure.medicalProcedureId,
                medicalProcedureName: prevMedicalProcedure.medicalProcedureName,
                medicalProcedurePrice:
                  prevMedicalProcedure.medicalProcedurePrice,
              };
            } else {
              return prevMedicalProcedure;
            }
          }
        );
        return updatedMedicalProcedures;
      });
    }
  }

  const handleDrop = (e, groupId: string) => {
    const selected = dragData.medicalProcedureId;
    changeGroup(dragData.medicalProcedureId, dragData.originalGroupId, groupId);
    setIsDragging(false);
  };

  useEffect(() => {
    console.log("dragData", dragData);
  }, [dragData]);

  useEffect(() => {
    console.log("medicalProcedures", medicalProcedures);
  }, [medicalProcedures]);

  return (
    <>
      <div className="flex">
        {groups.length > 0 &&
          groups.map((group: Group) => (
            <div
              // //  && isDragging && "bg-red-200"
              className={`w-1/4 h-96  ${
                group.groupId !== "123456" ? "border" : "border-dotted border-8"
              } m-4`}
              onDragEnter={(e) => handleDragEnter(e, group)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, group.groupId!)}
            >
              <div className="flex font-bold justify-center items-center">
                {group.groupName}
              </div>
              {medicalProcedures.length > 0 &&
                medicalProcedures.map(
                  (medicalProcedure: any) =>
                    group.groupId === medicalProcedure.groupId && (
                      <div
                        className={`flex items-center border m-1 transition-all  ${
                          isDragging &&
                          dragData.medicalProcedureId ===
                            medicalProcedure.medicalProcedureId
                            ? "opacity-0 duration-500"
                            : "opacity-100 duration-500"
                        }`}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, medicalProcedure, group)
                        }
                        onClick={() => {
                          setDragData({
                            groupId: group.groupId,
                            originalGroupId: medicalProcedure.groupId,
                            ...medicalProcedure,
                          });
                        }}
                        onDoubleClick={() => {
                          setDragData({
                            groupId: group.groupId,
                            originalGroupId: medicalProcedure.groupId,
                            ...medicalProcedure,
                          });
                          medicalProcedure.groupId === "123456"
                            ? changeGroup(
                                dragData.medicalProcedureId,
                                dragData.originalGroupId,
                                dragData.originalGroupId
                              )
                            : changeGroup(
                                dragData.medicalProcedureId,
                                dragData.originalGroupId,
                                "123456"
                              );
                        }}
                      >
                        <VscDash />
                        {medicalProcedure.medicalProcedureName}&nbsp;
                        {group.groupId === "123456" && (
                          <span>
                            {medicalProcedure.medicalProcedurePrice} RON
                          </span>
                        )}
                      </div>
                    )
                )}
            </div>
            //   <div>hello</div>
          ))}
      </div>
    </>
  );
};
