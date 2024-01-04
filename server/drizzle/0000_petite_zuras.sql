DO $$ BEGIN
 CREATE TYPE "userGender" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinicschema"."DoctorSpecialitiesMapping" (
	"doctorSpecialityMappingId" varchar(256) PRIMARY KEY NOT NULL,
	"doctorId" varchar NOT NULL,
	"specialityId" varchar NOT NULL,
	"isPrimarySpeciality" boolean NOT NULL,
	"isSecondarySpeciality" boolean NOT NULL,
	"isTertiarySpeciality" boolean NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinicschema"."Role" (
	"roleId" varchar PRIMARY KEY NOT NULL,
	"roleName" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Role_roleName_unique" UNIQUE("roleName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinicschema"."Speciality" (
	"specialityId" varchar PRIMARY KEY NOT NULL,
	"specialityName" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Speciality_specialityName_unique" UNIQUE("specialityName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinicschema"."User" (
	"userId" varchar PRIMARY KEY NOT NULL,
	"userForename" varchar(100) NOT NULL,
	"userSurname" varchar(100) NOT NULL,
	"userEmail" varchar(256) NOT NULL,
	"userPhoneNumber" varchar(50) NOT NULL,
	"userGender" "userGender" NOT NULL,
	"userDateOfBirth" date NOT NULL,
	"userAddress" varchar(256) NOT NULL,
	"userEncryptedPassword" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "User_userEmail_unique" UNIQUE("userEmail"),
	CONSTRAINT "User_userPhoneNumber_unique" UNIQUE("userPhoneNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinicschema"."UserRolesMapping" (
	"userRoleMappingId" varchar(256) PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"roleId" varchar NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinicschema"."DoctorSpecialitiesMapping" ADD CONSTRAINT "DoctorSpecialitiesMapping_doctorId_User_userId_fk" FOREIGN KEY ("doctorId") REFERENCES "clinicschema"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinicschema"."DoctorSpecialitiesMapping" ADD CONSTRAINT "DoctorSpecialitiesMapping_specialityId_Speciality_specialityId_fk" FOREIGN KEY ("specialityId") REFERENCES "clinicschema"."Speciality"("specialityId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinicschema"."UserRolesMapping" ADD CONSTRAINT "UserRolesMapping_userId_User_userId_fk" FOREIGN KEY ("userId") REFERENCES "clinicschema"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinicschema"."UserRolesMapping" ADD CONSTRAINT "UserRolesMapping_roleId_Role_roleId_fk" FOREIGN KEY ("roleId") REFERENCES "clinicschema"."Role"("roleId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
