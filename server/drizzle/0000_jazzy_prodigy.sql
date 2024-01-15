DO $$ BEGIN
 CREATE TYPE "appointmentStatus" AS ENUM('scheduled', 'rescheduled', 'completed', 'no-show', 'pending approval', 'waiting', 'confirmed by patient', 'canceled by patient');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "userGender" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."Appointment" (
	"appointmentId" varchar PRIMARY KEY NOT NULL,
	"appointmentDoctorId" varchar(100) NOT NULL,
	"appointmentPatientId" varchar(100) NOT NULL,
	"appointmentReason" varchar(256) NOT NULL,
	"appointmentDateTime" timestamp NOT NULL,
	"appointmentStatus" "appointmentStatus" DEFAULT 'scheduled' NOT NULL,
	"appointmentCancellationReason" varchar(256),
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."AppointmentHistory" (
	"appointmentHistoryId" varchar PRIMARY KEY NOT NULL,
	"appointmentId" varchar(100) NOT NULL,
	"appointmentHistoryDoctorId" varchar(100) NOT NULL,
	"appointmentHistoryPatientId" varchar(100) NOT NULL,
	"appointmentHistoryReason" varchar(256) NOT NULL,
	"appointmentHistoryDateTime" timestamp NOT NULL,
	"appointmentHistoryStatus" "appointmentStatus" DEFAULT 'scheduled' NOT NULL,
	"appointmentHistoryCancellationReason" varchar(256),
	"appointmentHistoryCreatedBy" varchar(100),
	"appointmentHistoryUpdatedBy" varchar(100),
	"appointmentHistoryCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"appointmentHistoryUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."DoctorSpecialityMapping" (
	"doctorId" varchar NOT NULL,
	"specialityId" varchar NOT NULL,
	"isPrimarySpeciality" boolean NOT NULL,
	"isSecondarySpeciality" boolean NOT NULL,
	"isTertiarySpeciality" boolean NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "DoctorSpecialityMapping_doctorId_specialityId_pk" PRIMARY KEY("doctorId","specialityId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."MedicalRecordPatient" (
	"medicalRecordPatientId" varchar PRIMARY KEY NOT NULL,
	"appointmentId" varchar(100) NOT NULL,
	"symptoms" varchar(256) NOT NULL,
	"conductedTests" varchar(256) NOT NULL,
	"diagnosis" varchar(256) NOT NULL,
	"recommendations" varchar(256) NOT NULL,
	"medicalRecordPatientCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"medicalRecordPatientUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."Role" (
	"roleId" varchar PRIMARY KEY NOT NULL,
	"roleName" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Role_roleName_unique" UNIQUE("roleName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."Speciality" (
	"specialityId" varchar PRIMARY KEY NOT NULL,
	"specialityName" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Speciality_specialityName_unique" UNIQUE("specialityName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."User" (
	"userId" varchar PRIMARY KEY NOT NULL,
	"userForename" varchar(100) NOT NULL,
	"userSurname" varchar(100) NOT NULL,
	"userEmail" varchar(256) NOT NULL,
	"userPhoneNumber" varchar(50) NOT NULL,
	"userGender" "userGender" NOT NULL,
	"userDateOfBirth" date NOT NULL,
	"userAddress" varchar(256) NOT NULL,
	"userEncryptedPassword" varchar(256) NOT NULL,
	"isUserActivated" boolean DEFAULT false NOT NULL,
	"isUserApprovedByAdmin" boolean DEFAULT false NOT NULL,
	"isUserBanned" boolean DEFAULT false NOT NULL,
	"userCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"userUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "User_userEmail_unique" UNIQUE("userEmail"),
	CONSTRAINT "User_userPhoneNumber_unique" UNIQUE("userPhoneNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."UserRoleMapping" (
	"userId" varchar NOT NULL,
	"roleId" varchar NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "UserRoleMapping_userId_roleId_pk" PRIMARY KEY("userId","roleId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."Appointment" ADD CONSTRAINT "Appointment_appointmentDoctorId_User_userId_fk" FOREIGN KEY ("appointmentDoctorId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."Appointment" ADD CONSTRAINT "Appointment_appointmentPatientId_User_userId_fk" FOREIGN KEY ("appointmentPatientId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_appointmentId_Appointment_appointmentId_fk" FOREIGN KEY ("appointmentId") REFERENCES "iatropolis"."Appointment"("appointmentId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_appointmentHistoryDoctorId_User_userId_fk" FOREIGN KEY ("appointmentHistoryDoctorId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_appointmentHistoryPatientId_User_userId_fk" FOREIGN KEY ("appointmentHistoryPatientId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_appointmentHistoryCreatedBy_User_userId_fk" FOREIGN KEY ("appointmentHistoryCreatedBy") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."AppointmentHistory" ADD CONSTRAINT "AppointmentHistory_appointmentHistoryUpdatedBy_User_userId_fk" FOREIGN KEY ("appointmentHistoryUpdatedBy") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."DoctorSpecialityMapping" ADD CONSTRAINT "DoctorSpecialityMapping_doctorId_User_userId_fk" FOREIGN KEY ("doctorId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."DoctorSpecialityMapping" ADD CONSTRAINT "DoctorSpecialityMapping_specialityId_Speciality_specialityId_fk" FOREIGN KEY ("specialityId") REFERENCES "iatropolis"."Speciality"("specialityId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."MedicalRecordPatient" ADD CONSTRAINT "MedicalRecordPatient_appointmentId_Appointment_appointmentId_fk" FOREIGN KEY ("appointmentId") REFERENCES "iatropolis"."Appointment"("appointmentId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."UserRoleMapping" ADD CONSTRAINT "UserRoleMapping_userId_User_userId_fk" FOREIGN KEY ("userId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."UserRoleMapping" ADD CONSTRAINT "UserRoleMapping_roleId_Role_roleId_fk" FOREIGN KEY ("roleId") REFERENCES "iatropolis"."Role"("roleId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
