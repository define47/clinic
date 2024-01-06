// console.log(fastifyServer.config);

const baseRepositoryUsers = new BaseRepository(drizzleInstance, userTable);
const baseRepositoryRoles = new BaseRepository(drizzleInstance, roleTable);
const baseRepositorySpecialities = new BaseRepository(
  drizzleInstance,
  specialityTable
);
const baseRepositoryUserRolesMapping = new BaseRepository(
  drizzleInstance,
  userRolesMappingsTable
);
const baseRepositoryDoctorSpecialitiesMapping = new BaseRepository(
  drizzleInstance,
  doctorSpecialitiesMappingsTable
);

console.log(
  "herenow",
  await baseRepositoryUsers.getByAttribute(
    "userId",
    "48631bef-8a77-51ca-b719-dfe17b719081"
  )
);

console.log(
  "herenow",
  await baseRepositoryRoles.getByAttribute(
    "roleId",
    "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8"
  )
);

const { redis } = fastifyServer;
// await redis.set("mykey2024", "myvalue2024");

console.log(await redis.get("mykey2024"));

// await baseRepositoryUserRolesMapping.create({ userId: "", roleId: "" });

// const user = await baseRepositoryUsers.create({
//   userForename: "test1fn",
//   userSurname: "test1ln",
//   userEmail: "test1em",
//   userPhoneNumber: "test1ph",
//   userGender: "male",
//   userDateOfBirth: "1234-01-01",
//   userAddress: "test1addr",
//   userEncryptedPassword: "test1pass",
// });
// console.log(user);

// const patientRole = await baseRepositoryRoles.create({
//   roleName: "patient",
// });
// console.log(patientRole);

// const neurologySpeciality = await baseRepositorySpecialities.create({
//   specialityName: "Neurology",
// });
// console.log(neurologySpeciality);

// const userRoleMapping = await baseRepositoryUserRolesMapping.create({
//   userId: "48631bef-8a77-51ca-b719-dfe17b719081",
//   roleId: "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8",
// });
// console.log(userRoleMapping);

// const doctorSpecialityMapping =
//   await baseRepositoryDoctorSpecialitiesMapping.create({
//     doctorId: "48631bef-8a77-51ca-b719-dfe17b719081",
//     specialityId: "108aa19f-40e9-561c-a88a-53ad20a6c99e",
//     isPrimarySpeciality: true,
//     isSecondarySpeciality: false,
//     isTertiarySpeciality: false,
//   });
// console.log(doctorSpecialityMapping);

// console.log(
//   await baseRepositoryUsers.getById("48631bef-8a77-51ca-b719-dfe17b719081")
// );
// console.log(
//   await baseRepositoryRoles.getById("0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8")
// );
// console.log(
//   await baseRepositorySpecialities.getById(
//     "108aa19f-40e9-561c-a88a-53ad20a6c99e"
//   )
// );

// await baseRepositoryUsers.delete("48631bef-8a77-51ca-b719-dfe17b719081");
// await baseRepositoryRoles.delete("0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8");
// await baseRepositorySpecialities.delete(
//   "108aa19f-40e9-561c-a88a-53ad20a6c99e"
// );

// const userToUpdate = await baseRepositoryUsers.update(
//   "48631bef-8a77-51ca-b719-dfe17b719081",
//   {
//     userForename: "test1fnup",
//     userSurname: "test1lnupdated",
//     userEmail: "test1emupup",
//     userPhoneNumber: "test1phy",
//     userGender: "male",
//     userDateOfBirth: "1234-01-01",
//     userAddress: "test1addrupup",
//     userEncryptedPassword: "test1passqqqq",
//   }
// );
// console.log(userToUpdate);

// const roleToUpdate = await baseRepositoryRoles.update(
//   "0f6c88ca-a4b3-55d3-814b-4cd4daf3cac8",
//   { roleName: "patient updated" }
// );
// console.log(roleToUpdate);
