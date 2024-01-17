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
	"appointmentDateTime" timestamp NOT NULL,
	"appointmentReason" varchar(256) NOT NULL,
	"appointmentStatus" "appointmentStatus" DEFAULT 'scheduled' NOT NULL,
	"appointmentCancellationReason" varchar(256),
	"appointmentCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"appointmentUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."AppointmentHistory" (
	"appointmentHistoryId" varchar PRIMARY KEY NOT NULL,
	"appointmentId" varchar(100) NOT NULL,
	"appointmentHistoryDoctorId" varchar(100) NOT NULL,
	"appointmentHistoryPatientId" varchar(100) NOT NULL,
	"appointmentHistoryDateTime" timestamp NOT NULL,
	"appointmentHistoryReason" varchar(256) NOT NULL,
	"appointmentHistoryStatus" "appointmentStatus" DEFAULT 'scheduled' NOT NULL,
	"appointmentHistoryCancellationReason" varchar(256),
	"appointmentHistoryCreatedBy" varchar(100),
	"appointmentHistoryUpdatedBy" varchar(100),
	"appointmentHistoryCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"appointmentHistoryUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."DoctorMedicalSpecialityMapping" (
	"doctorId" varchar NOT NULL,
	"medicalSpecialityId" varchar NOT NULL,
	"isPrimaryMedicalSpeciality" boolean NOT NULL,
	"isSecondaryMedicalSpeciality" boolean NOT NULL,
	"isTertiaryMedicalSpeciality" boolean NOT NULL,
	"doctorMedicalSpecialityMappingCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"doctorMedicalSpecialityMappingUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "DoctorMedicalSpecialityMapping_doctorId_medicalSpecialityId_pk" PRIMARY KEY("doctorId","medicalSpecialityId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."Language" (
	"languageId" varchar PRIMARY KEY NOT NULL,
	"languageName" varchar(256) NOT NULL,
	"languageCode" varchar(256) NOT NULL,
	"languageCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"languageUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Language_languageName_unique" UNIQUE("languageName"),
	CONSTRAINT "Language_languageCode_unique" UNIQUE("languageCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."MedicalProcedure" (
	"medicalProcedureId" varchar PRIMARY KEY NOT NULL,
	"medicalProcedureName" varchar NOT NULL,
	"medicalProcedurePrice" integer NOT NULL,
	"medicalProcedureCreatedAt" timestamp NOT NULL,
	"medicalProcedureUpdatedAt" timestamp NOT NULL
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
CREATE TABLE IF NOT EXISTS "iatropolis"."MedicalSpeciality" (
	"medicalSpecialityId" varchar PRIMARY KEY NOT NULL,
	"medicalSpecialityName" varchar(50) NOT NULL,
	"medicalSpecialityCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"medicalSpecialityUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "MedicalSpeciality_medicalSpecialityName_unique" UNIQUE("medicalSpecialityName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."MedicalSpecialityMedicalProcedureMapping" (
	"medicalSpecialityId" varchar NOT NULL,
	"medicalProcedureId" varchar NOT NULL,
	"medicalSpecialityMedicalProcedureMappingCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"medicalSpecialityMedicalProcedureMappingUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "MedicalSpecialityMedicalProcedureMapping_medicalSpecialityId_medicalProcedureId_pk" PRIMARY KEY("medicalSpecialityId","medicalProcedureId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."Role" (
	"roleId" varchar PRIMARY KEY NOT NULL,
	"roleName" varchar(50) NOT NULL,
	"roleCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"roleUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "Role_roleName_unique" UNIQUE("roleName")
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
	"isUserEmailActivated" boolean DEFAULT false NOT NULL,
	"isUserApprovedByAdmin" boolean DEFAULT false NOT NULL,
	"isUserBanned" boolean DEFAULT false NOT NULL,
	"userCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"userUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "User_userEmail_unique" UNIQUE("userEmail"),
	CONSTRAINT "User_userPhoneNumber_unique" UNIQUE("userPhoneNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."UserPreferencesMapping" (
	"userId" varchar NOT NULL,
	"languageId" varchar NOT NULL,
	"isDarkModeOn" varchar NOT NULL,
	CONSTRAINT "UserPreferencesMapping_userId_pk" PRIMARY KEY("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."UserRoleMapping" (
	"userId" varchar NOT NULL,
	"roleId" varchar NOT NULL,
	"userRoleMappingCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"userRoleMappingUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
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
 ALTER TABLE "iatropolis"."DoctorMedicalSpecialityMapping" ADD CONSTRAINT "DoctorMedicalSpecialityMapping_doctorId_User_userId_fk" FOREIGN KEY ("doctorId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."DoctorMedicalSpecialityMapping" ADD CONSTRAINT "DoctorMedicalSpecialityMapping_medicalSpecialityId_MedicalSpeciality_medicalSpecialityId_fk" FOREIGN KEY ("medicalSpecialityId") REFERENCES "iatropolis"."MedicalSpeciality"("medicalSpecialityId") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "iatropolis"."MedicalSpecialityMedicalProcedureMapping" ADD CONSTRAINT "MedicalSpecialityMedicalProcedureMapping_medicalSpecialityId_MedicalSpeciality_medicalSpecialityId_fk" FOREIGN KEY ("medicalSpecialityId") REFERENCES "iatropolis"."MedicalSpeciality"("medicalSpecialityId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."MedicalSpecialityMedicalProcedureMapping" ADD CONSTRAINT "MedicalSpecialityMedicalProcedureMapping_medicalProcedureId_MedicalProcedure_medicalProcedureId_fk" FOREIGN KEY ("medicalProcedureId") REFERENCES "iatropolis"."MedicalProcedure"("medicalProcedureId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."UserPreferencesMapping" ADD CONSTRAINT "UserPreferencesMapping_userId_User_userId_fk" FOREIGN KEY ("userId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."UserPreferencesMapping" ADD CONSTRAINT "UserPreferencesMapping_languageId_Language_languageId_fk" FOREIGN KEY ("languageId") REFERENCES "iatropolis"."Language"("languageId") ON DELETE no action ON UPDATE no action;
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
