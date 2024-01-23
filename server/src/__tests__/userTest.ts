import { describe, it } from "node:test";
import { UserService } from "../services/user.service";
import assert from "node:assert";
import { UserRoleMappingService } from "../services/userRoleMapping.service";
import { DoctorMedicalSpecialityMappingService } from "../services/doctorMedicalSpecialityMapping.service";

const userService = new UserService();
const userRoleMappingService = new UserRoleMappingService();
const doctorMedicalSpecialityMappingService =
  new DoctorMedicalSpecialityMappingService();

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() =>
    console.info(message, other)
  );
};

export const testUser = async () => {
  const dummyAdminId = "13098cb2-3005-599a-affe-70bd8bac5f3b";
  const dummyDoctorId = "eef281d3-2441-5f0c-9864-c9fd863ed84a";
  const dummyPatientId = "46a33941-3d5d-5b5f-afd8-f887f34a335f";

  const adminRoleId = "59660f36-bdb1-5941-9d0a-e72ec3d52c07";
  const receptionistRoleId = "55f8998c-e96e-5341-a970-6ab6694dde68";
  const patientRoleId = "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8";
  const doctorRoleId = "0db07f94-ca81-5fa0-9497-1967481f576a";

  describe("<USER>", () => {
    describe("<PATIENT>", () => {
      it("create patient", async () => {
        const newPatient = await userService.createUser({
          userForename: "patientfn0",
          userSurname: "patientln0",
          userEmail: "patientem0@gmail.com",
          userPhoneNumber: "patientph0",
          userDateOfBirth: "1234-01-01",
          userGender: "male",
          userAddress: "patientaddr0",
          userEncryptedPassword: "patientpass0",
        });
        // console.log("newPatient", newPatient);
        const expectedPatient = {
          userId: dummyPatientId,
          userForename: "patientfn0",
          userSurname: "patientln0",
          userEmail: "patientem0@gmail.com",
          userPhoneNumber: "patientph0",
          userDateOfBirth: "1234-01-01",
          userGender: "male",
          userAddress: "patientaddr0",
          userEncryptedPassword: "patientpass0",
        };
        // console.log("expectedPatient", expectedPatient);
        assert.deepEqual(newPatient, expectedPatient);
      });
      it("create patient role mapping", async () => {
        const patientRoleMappingToCreate =
          await userRoleMappingService.createUserRoleMapping({
            userId: dummyPatientId,
            roleId: patientRoleId,
          });
        // console.log("patientRoleMappingToCreate", patientRoleMappingToCreate);
        const patientRoleMappingToCreateExpected = {
          userId: dummyPatientId,
          roleId: patientRoleId,
        };
        // console.log(
        //   "patientRoleMappingToCreateExpected",
        //   patientRoleMappingToCreateExpected
        // );
        assert.deepEqual(
          patientRoleMappingToCreate,
          patientRoleMappingToCreateExpected
        );
      });

      it("update patient", async () => {
        const patientToUpdate = await userService.updateUser(dummyPatientId, {
          userForename: "patientfn0 updated",
          userSurname: "patientln0 updated",
          userEmail: "patientem0@gmail.com updated",
          userPhoneNumber: "patientph0 updated",
          userDateOfBirth: "1234-01-01",
          userGender: "male",
          userAddress: "patientaddr0 updated",
        });

        const patientToUpdateExpected = {
          userId: "46a33941-3d5d-5b5f-afd8-f887f34a335f",
          userForename: "patientfn0 updated",
          userSurname: "patientln0 updated",
          userEmail: "patientem0@gmail.com updated",
          userPhoneNumber: "patientph0 updated",
          userGender: "male",
          userDateOfBirth: "1234-01-01",
          userAddress: "patientaddr0 updated",
          userEncryptedPassword: "patientpass0",
          isUserEmailActivated: false,
          isUserApprovedByAdmin: false,
          isUserBanned: false,
        };

        // console.log("patientToUpdate", patientToUpdate);

        assert.deepEqual(patientToUpdate, patientToUpdateExpected);
      });
      it("delete patient role mapping", async () => {
        const patientRoleMappingToDelete =
          await userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId(
            dummyPatientId,
            patientRoleId
          );
        // console.log("patientRoleMappingToDelete", patientRoleMappingToDelete);
        const patientRoleMappingToDeleteExpected = {
          userId: dummyPatientId,
          roleId: patientRoleId,
        };
        // console.log(
        //   "patientRoleMappingToDeleteExpected",
        //   patientRoleMappingToDeleteExpected
        // );
        assert.deepEqual(
          patientRoleMappingToDelete,
          patientRoleMappingToDeleteExpected
        );
      });
      it("delete patient", async () => {
        const patientToDelete = await userService.deleteUser(dummyPatientId);
        // console.log("patientToDelete", patientToDelete);
        assert.equal(patientToDelete, dummyPatientId);
      });
    });
  });

  describe("<ADMIN>", () => {
    it("create admin", async () => {
      const adminToCreate = await userService.createUser({
        userForename: "adminfn0",
        userSurname: "adminln0",
        userEmail: "adminem0@gmail.com",
        userPhoneNumber: "adminph0",
        userDateOfBirth: "1234-01-01",
        userGender: "male",
        userAddress: "adminaddr0",
        userEncryptedPassword: "adminpass0",
      });
      // console.log("adminToCreate", adminToCreate);
      const adminToCreateExpected = {
        userId: dummyAdminId,
        userForename: "adminfn0",
        userSurname: "adminln0",
        userEmail: "adminem0@gmail.com",
        userPhoneNumber: "adminph0",
        userDateOfBirth: "1234-01-01",
        userGender: "male",
        userAddress: "adminaddr0",
        userEncryptedPassword: "adminpass0",
      };
      assert.deepEqual(adminToCreate, adminToCreateExpected);
    });

    it("create admin role mapping", async () => {
      const adminRoleMappingToCreate =
        await userRoleMappingService.createUserRoleMapping({
          userId: dummyAdminId,
          roleId: adminRoleId,
        });

      const adminRoleMappingToCreateExpected = {
        userId: dummyAdminId,
        roleId: adminRoleId,
      };

      assert.deepEqual(
        adminRoleMappingToCreate,
        adminRoleMappingToCreateExpected
      );
    });

    it("update admin", async () => {
      const adminToUpdate = await userService.updateUser(dummyAdminId, {
        userForename: "adminfn0 updated",
        userSurname: "adminln0 updated",
        userEmail: "adminem0@gmail.com updated",
        userPhoneNumber: "adminph0 updated",
        userDateOfBirth: "1234-01-01",
        userGender: "male",
        userAddress: "adminaddr0 updated",
      });

      const adminToUpdateExpected = {
        userId: dummyAdminId,
        userForename: "adminfn0 updated",
        userSurname: "adminln0 updated",
        userEmail: "adminem0@gmail.com updated",
        userPhoneNumber: "adminph0 updated",
        userGender: "male",
        userDateOfBirth: "1234-01-01",
        userAddress: "adminaddr0 updated",
        userEncryptedPassword: "adminpass0",
        isUserEmailActivated: false,
        isUserApprovedByAdmin: false,
        isUserBanned: false,
      };

      // console.log("adminToUpdate", adminToUpdateExpected);

      assert.deepEqual(adminToUpdate, adminToUpdateExpected);
    });

    it("delete admin role mapping", async () => {
      const adminRoleMappingToDelete =
        await userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId(
          dummyAdminId,
          adminRoleId
        );

      const adminRoleMappingToDeleteExpected = {
        userId: dummyAdminId,
        roleId: adminRoleId,
      };

      // console.log("adminRoleMappingToDelete", adminRoleMappingToDelete);

      assert.deepEqual(
        adminRoleMappingToDelete,
        adminRoleMappingToDeleteExpected
      );
    });

    it("delete admin", async () => {
      const adminToDelete = await userService.deleteUser(dummyAdminId);
      // console.log("adminToDelete", adminToDelete);
      assert.equal(adminToDelete, dummyAdminId);
    });
  });
  describe("<DOCTOR>", () => {
    it("create doctor", async () => {
      const doctorToCreate = await userService.createUser({
        userForename: "doctorfn0",
        userSurname: "doctorln0",
        userEmail: "doctorem0@gmail.com",
        userPhoneNumber: "doctorph0",
        userDateOfBirth: "1234-01-01",
        userGender: "male",
        userAddress: "doctoraddr0",
        userEncryptedPassword: "doctorpass0",
      });
      // console.log("doctorToCreate", doctorToCreate);
      const doctorToCreateExpected = {
        userId: dummyDoctorId,
        userForename: "doctorfn0",
        userSurname: "doctorln0",
        userEmail: "doctorem0@gmail.com",
        userPhoneNumber: "doctorph0",
        userDateOfBirth: "1234-01-01",
        userGender: "male",
        userAddress: "doctoraddr0",
        userEncryptedPassword: "doctorpass0",
      };
      assert.deepEqual(doctorToCreate, doctorToCreateExpected);
    });

    it("create doctor role mapping", async () => {
      const doctorRoleMappingToCreate =
        await userRoleMappingService.createUserRoleMapping({
          userId: dummyDoctorId,
          roleId: doctorRoleId,
        });

      const doctorRoleMappingToCreateExpected = {
        userId: dummyDoctorId,
        roleId: doctorRoleId,
      };

      assert.deepEqual(
        doctorRoleMappingToCreate,
        doctorRoleMappingToCreateExpected
      );
    });

    it("update doctor", async () => {
      const doctorToUpdate = await userService.updateUser(dummyDoctorId, {
        userForename: "doctorfn0 updated",
        userSurname: "doctorln0 updated",
        userEmail: "doctorem0@gmail.com updated",
        userPhoneNumber: "doctorph0 updated",
        userDateOfBirth: "1234-01-01",
        userGender: "male",
        userAddress: "doctoraddr0 updated",
      });

      const doctorToUpdateExpected = {
        userId: dummyDoctorId,
        userForename: "doctorfn0 updated",
        userSurname: "doctorln0 updated",
        userEmail: "doctorem0@gmail.com updated",
        userPhoneNumber: "doctorph0 updated",
        userGender: "male",
        userDateOfBirth: "1234-01-01",
        userAddress: "doctoraddr0 updated",
        userEncryptedPassword: "doctorpass0",
        isUserEmailActivated: false,
        isUserApprovedByAdmin: false,
        isUserBanned: false,
      };

      // console.log("doctorToUpdate", doctorToUpdate);

      assert.deepEqual(doctorToUpdate, doctorToUpdateExpected);
    });

    it("create doctor primary speciality mapping", async () => {
      const primarySpecialityId = "08721aa2-0b17-5173-8fa2-746443d2aa5f";

      const doctorPrimarySpecialityMapping =
        await doctorMedicalSpecialityMappingService.createMedicalDoctorSpecialityMapping(
          {
            userId: dummyDoctorId,
            medicalSpecialityId: primarySpecialityId,
            isPrimaryMedicalSpeciality: true,
            isSecondaryMedicalSpeciality: false,
            isTertiaryMedicalSpeciality: false,
          }
        );

      const doctorPrimarySpecialityMappingExpected = {
        userId: dummyDoctorId,
        medicalSpecialityId: primarySpecialityId,
        isPrimaryMedicalSpeciality: true,
        isSecondaryMedicalSpeciality: false,
        isTertiaryMedicalSpeciality: false,
      };

      assert.deepEqual(
        doctorPrimarySpecialityMapping,
        doctorPrimarySpecialityMappingExpected
      );
    });

    it("create doctor secondary speciality mapping", async () => {
      const secondarySpecialityId = "108aa19f-40e9-561c-a88a-53ad20a6c99e";

      const doctorSecondarySpecialityMapping =
        await doctorMedicalSpecialityMappingService.createMedicalDoctorSpecialityMapping(
          {
            userId: dummyDoctorId,
            medicalSpecialityId: secondarySpecialityId,
            isPrimaryMedicalSpeciality: false,
            isSecondaryMedicalSpeciality: true,
            isTertiaryMedicalSpeciality: false,
          }
        );

      const doctorSecondarySpecialityMappingExpected = {
        userId: dummyDoctorId,
        medicalSpecialityId: secondarySpecialityId,
        isPrimaryMedicalSpeciality: false,
        isSecondaryMedicalSpeciality: true,
        isTertiaryMedicalSpeciality: false,
      };

      assert.deepEqual(
        doctorSecondarySpecialityMapping,
        doctorSecondarySpecialityMappingExpected
      );
    });

    it("create doctor tertiary speciality mapping", async () => {
      const tertiarySpecialityId = "21041809-4d79-57ce-818a-712c959e936c";

      const doctorTertiarySpecialityMapping =
        await doctorMedicalSpecialityMappingService.createMedicalDoctorSpecialityMapping(
          {
            userId: dummyDoctorId,
            medicalSpecialityId: tertiarySpecialityId,
            isPrimaryMedicalSpeciality: false,
            isSecondaryMedicalSpeciality: false,
            isTertiaryMedicalSpeciality: true,
          }
        );

      const doctorTertiarySpecialityMappingExpected = {
        userId: dummyDoctorId,
        medicalSpecialityId: tertiarySpecialityId,
        isPrimaryMedicalSpeciality: false,
        isSecondaryMedicalSpeciality: false,
        isTertiaryMedicalSpeciality: true,
      };

      assert.deepEqual(
        doctorTertiarySpecialityMapping,
        doctorTertiarySpecialityMappingExpected
      );
    });

    it("delete doctor ALL speciality mappings", async () => {
      const deletedMedicalSpecialitiesMappings =
        await doctorMedicalSpecialityMappingService.deleteDoctorMedicalSpecialityMappingsByDoctorId(
          dummyDoctorId
        );

      // console.log(
      //   "deletedMedicalSpecialitiesMappings ALL",
      //   deletedMedicalSpecialitiesMappings
      // );

      const deletedMedicalSpecialitiesMappingExpected = dummyDoctorId;

      assert.deepEqual(
        deletedMedicalSpecialitiesMappings,
        deletedMedicalSpecialitiesMappingExpected
      );
    });

    it("delete doctor role mapping", async () => {
      const doctorRoleMappingToDelete =
        await userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId(
          dummyDoctorId,
          doctorRoleId
        );

      const doctorRoleMappingToDeleteExpected = {
        userId: dummyDoctorId,
        roleId: doctorRoleId,
      };

      // console.log("doctorRoleMappingToDelete", doctorRoleMappingToDelete);

      assert.deepEqual(
        doctorRoleMappingToDelete,
        doctorRoleMappingToDeleteExpected
      );
    });

    it("delete doctor", async () => {
      const doctorToDelete = await userService.deleteUser(dummyDoctorId);
      // console.log("doctorToDelete", doctorToDelete);
      assert.equal(doctorToDelete, dummyDoctorId);
    });
  });
};
