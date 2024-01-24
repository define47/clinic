import { DoctorMedicalSpecialityMappingService } from "../services/doctorMedicalSpecialityMapping.service";
import { MedicalSpecialityService } from "../services/medicalSpeciality.service";
import { UserService } from "../services/user.service";
import { UserRoleMappingService } from "../services/userRoleMapping.service";

const userService = new UserService();
const userRoleMappingService = new UserRoleMappingService();
const specialityService = new MedicalSpecialityService();
const doctorSpecialityMappingService =
  new DoctorMedicalSpecialityMappingService();

const user1Id = "143c3b8d-c169-5ce2-9a1c-58a666262115";

const adminRoleId = "59660f36-bdb1-5941-9d0a-e72ec3d52c07";
const doctorRoleId = "0db07f94-ca81-5fa0-9497-1967481f576a";
const patientId = "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8";

const internalMedicineId = "08721aa2-0b17-5173-8fa2-746443d2aa5f";
const neurologyId = "108aa19f-40e9-561c-a88a-53ad20a6c99e";
const dermatologyId = "21041809-4d79-57ce-818a-712c959e936c";
const anesthesiologyId = "b6fc4cff-c43e-5db6-ad00-043dc50b8563";

export async function testUsers(shouldDelete: boolean) {
  {
    const user1 = await userService.createUser({
      userForename: "userForenameAdminDoctorTest",
      userSurname: "userSurnameAdminDoctorTest",
      userEmail: "userEmailAdminDoctorTest",
      userPhoneNumber: "userPhoneNumberAdminDoctorTest",
      userGender: "male",
      userDateOfBirth: "1234-01-01",
      userAddress: "userAddressAdminDoctorTest",
      userEncryptedPassword: "userAdminDoctorPassword",
    });
    console.log("Created User1:", user1);

    const user1Updated = await userService.updateUser(user1Id, {
      userForename: "userForenameAdminDoctorTest Updated",
      userSurname: "userSurnameAdminDoctorTest Updated",
      userEmail: "userEmailAdminDoctorTest Updated",
      userPhoneNumber: "userPhoneNumberAdminDoctorTest Updated",
      userGender: "male",
      userDateOfBirth: "1234-01-01",
      userAddress: "userAddressAdminDoctorTest Updated",
      userEncryptedPassword: "userAdminDoctorPassword Updated",
    });
    console.log("Updated User1:", user1Updated);
  }

  {
  }

  if (shouldDelete) {
    const user1Deleted = await userService.deleteUser(user1Id);
    console.log("Deleted User1:", user1Deleted);
  }
}

export async function testUserRoleMapping(shouldDelete: boolean) {
  {
    const user1AdminRoleMappingCreated =
      await userRoleMappingService.createUserRoleMapping({
        userId: user1Id,
        roleId: adminRoleId,
      });
    console.log("User1 - Admin Mapping Created:", user1AdminRoleMappingCreated);

    const user1DoctorRoleMappingCreated =
      await userRoleMappingService.createUserRoleMapping({
        userId: user1Id,
        roleId: doctorRoleId,
      });
    console.log(
      "User1 - Doctor Mapping Created:",
      user1DoctorRoleMappingCreated
    );
  }

  if (shouldDelete) {
    const user1AdminRoleMappingDeleted =
      await userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId(
        user1Id,
        adminRoleId
      );
    console.log("User1 - Admin Mapping Deleted:", user1AdminRoleMappingDeleted);

    const user1DoctorRoleMappingDeleted =
      await userRoleMappingService.deleteUserRoleMappingByUserIdAndRoleId(
        user1Id,
        doctorRoleId
      );
    console.log(
      "User1 - Doctor Mapping Deleted:",
      user1DoctorRoleMappingDeleted
    );
  }
}

export async function testDoctorSpecialityMapping(shouldDelete: boolean) {
  {
    const user1InternalMedicineMapping =
      await doctorSpecialityMappingService.createMedicalDoctorSpecialityMapping(
        {
          userId: user1Id,
          medicalSpecialityId: internalMedicineId,
          isPrimaryMedicalSpeciality: true,
          isSecondaryMedicalSpeciality: false,
          isTertiaryMedicalSpeciality: false,
        }
      );
    console.log(
      "User1 - Internal Medicine Created",
      user1InternalMedicineMapping
    );

    const user1NeurologyMapping =
      await doctorSpecialityMappingService.createMedicalDoctorSpecialityMapping(
        {
          userId: user1Id,
          medicalSpecialityId: neurologyId,
          isPrimaryMedicalSpeciality: false,
          isSecondaryMedicalSpeciality: true,
          isTertiaryMedicalSpeciality: false,
        }
      );
    console.log("User1 - Neurology Created", user1NeurologyMapping);

    const user1AnesthesiologyMapping =
      await doctorSpecialityMappingService.createMedicalDoctorSpecialityMapping(
        {
          userId: user1Id,
          medicalSpecialityId: anesthesiologyId,
          isPrimaryMedicalSpeciality: false,
          isSecondaryMedicalSpeciality: false,
          isTertiaryMedicalSpeciality: true,
        }
      );
    console.log("User1 - Anesthesiology Created", user1AnesthesiologyMapping);
  }

  if (shouldDelete) {
    const user1InternalMedicineMappingDeleted =
      await doctorSpecialityMappingService.deleteDoctorMedicalSpecialityMappingByDoctorIdAndSpecialityId(
        user1Id,
        internalMedicineId
      );
    console.log(
      "User1 - Internal Medicine Deleted",
      user1InternalMedicineMappingDeleted
    );

    const user1NeurologyMappingDeleted =
      await doctorSpecialityMappingService.deleteDoctorMedicalSpecialityMappingByDoctorIdAndSpecialityId(
        user1Id,
        neurologyId
      );
    console.log("User1 - Neurology Deleted", user1NeurologyMappingDeleted);

    const user1AnesthesiologyMappingDeleted =
      await doctorSpecialityMappingService.deleteDoctorMedicalSpecialityMappingByDoctorIdAndSpecialityId(
        user1Id,
        anesthesiologyId
      );
    console.log(
      "User1 - Anesthesiology Deleted",
      user1AnesthesiologyMappingDeleted
    );
  }
}

export async function testSpeciality() {
  const newSpeciality = await specialityService.createMedicalSpeciality({
    medicalSpecialityName: "newSpecialityTest",
  });
  console.log("Speciality Created:", newSpeciality);

  const newSpecialityUpdated = await specialityService.updateMedicalSpeciality(
    "3de2103e-c221-5cfb-a352-bd22609ac85a",
    { medicalSpecialityName: "newSpecialityTestUpdated" }
  );
  console.log("Speciality Updated:", newSpecialityUpdated);

  const newSpecialityDeleted =
    await specialityService.deleteMedicalSpecialityById(
      "3de2103e-c221-5cfb-a352-bd22609ac85a"
    );

  console.log("Speciality Deleted:", newSpecialityDeleted);
}
