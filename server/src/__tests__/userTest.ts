import { describe, it } from "node:test";
import { UserService } from "../services/user.service";
import assert from "node:assert";
import { UserRoleMappingService } from "../services/userRoleMapping.service";

const userService = new UserService();
const userRoleMappingService = new UserRoleMappingService();

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() =>
    console.info(message, other)
  );
};

export const testUser = async () => {
  const dummyPatientId = "46a33941-3d5d-5b5f-afd8-f887f34a335f";
  const patientRoleId = "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8";
  describe("<USER>", () => {
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

      console.log("newPatient", newPatient);

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

      console.log("expectedPatient", expectedPatient);

      assert.deepEqual(newPatient, expectedPatient);
    });

    it("create patient role mapping", async () => {
      const patientRoleMappingToCreate =
        await userRoleMappingService.createUserRoleMapping({
          userId: dummyPatientId,
          roleId: patientRoleId,
        });

      console.log("patientRoleMappingToCreate", patientRoleMappingToCreate);

      const patientRoleMappingToCreateExpected = {
        userId: dummyPatientId,
        roleId: patientRoleId,
      };

      console.log(
        "patientRoleMappingToCreateExpected",
        patientRoleMappingToCreateExpected
      );

      assert.deepEqual(
        patientRoleMappingToCreate,
        patientRoleMappingToCreateExpected
      );
    });

    it("delete patient role mapping", async () => {
      const patientRoleMappingToDelete =
        await userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId(
          dummyPatientId,
          patientRoleId
        );

      console.log("patientRoleMappingToDelete", patientRoleMappingToDelete);

      const patientRoleMappingToDeleteExpected = {
        userId: dummyPatientId,
        roleId: patientRoleId,
      };

      console.log(
        "patientRoleMappingToDeleteExpected",
        patientRoleMappingToDeleteExpected
      );

      assert.deepEqual(
        patientRoleMappingToDelete,
        patientRoleMappingToDeleteExpected
      );
    });

    it("delete patient", async () => {
      const patientToDelete = await userService.deleteUser(dummyPatientId);

      console.log("patientToDelete", patientToDelete);

      assert.equal(patientToDelete, dummyPatientId);
    });
  });
};
