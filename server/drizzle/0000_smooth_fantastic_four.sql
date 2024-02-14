DO $$ BEGIN
 CREATE TYPE "appointmentStatus" AS ENUM('scheduled', 'rescheduled', 'completed', 'no-show', 'pending approval', 'waiting', 'confirmed by patient', 'canceled by patient', 'paid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "appointmentHistoryStatus" AS ENUM('scheduled', 'rescheduled', 'completed', 'no-show', 'pending approval', 'waiting', 'confirmed by patient', 'canceled by patient', 'paid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "notificationAction" AS ENUM('create', 'update', 'delete');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "notificationEntity" AS ENUM('user', 'speciality', 'appointment', 'medical record', 'appointment reminder');
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
	"appointmentStatus" "appointmentStatus" NOT NULL,
	"appointmentCancellationReason" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."AppointmentHistory" (
	"appointmentHistoryId" varchar PRIMARY KEY NOT NULL,
	"appointmentId" varchar(100) NOT NULL,
	"appointmentHistoryDoctorId" varchar(100) NOT NULL,
	"appointmentHistoryPatientId" varchar(100) NOT NULL,
	"appointmentHistoryDateTime" timestamp NOT NULL,
	"appointmentHistoryReason" varchar(256) NOT NULL,
	"appointmentHistoryStatus" "appointmentHistoryStatus" DEFAULT 'scheduled' NOT NULL,
	"appointmentHistoryCancellationReason" varchar(256),
	"appointmentHistoryCreatedBy" varchar(100) NOT NULL,
	"appointmentHistoryUpdatedBy" varchar(100) NOT NULL,
	"appointmentHistoryCreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"appointmentHistoryUpdatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."DoctorMedicalSpecialityMapping" (
	"doctorMedicalSpecialityMappingId" varchar(256) PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"medicalSpecialityId" varchar NOT NULL,
	"isPrimaryMedicalSpeciality" boolean NOT NULL,
	"isSecondaryMedicalSpeciality" boolean NOT NULL,
	"isTertiaryMedicalSpeciality" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."Language" (
	"languageId" varchar PRIMARY KEY NOT NULL,
	"languageName" varchar(256) NOT NULL,
	"languageCode" varchar(256) NOT NULL,
	CONSTRAINT "Language_languageName_unique" UNIQUE("languageName"),
	CONSTRAINT "Language_languageCode_unique" UNIQUE("languageCode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."MedicalProcedure" (
	"medicalProcedureId" varchar PRIMARY KEY NOT NULL,
	"medicalProcedureName" varchar NOT NULL,
	"medicalProcedurePrice" integer NOT NULL,
	CONSTRAINT "MedicalProcedure_medicalProcedureName_unique" UNIQUE("medicalProcedureName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."MedicalRecordPatient" (
	"medicalRecordPatientId" varchar PRIMARY KEY NOT NULL,
	"appointmentId" varchar(100) NOT NULL,
	"symptoms" varchar(256) NOT NULL,
	"conductedTests" varchar(256) NOT NULL,
	"diagnosis" varchar(256) NOT NULL,
	"recommendations" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."MedicalSpeciality" (
	"medicalSpecialityId" varchar PRIMARY KEY NOT NULL,
	"medicalSpecialityName" varchar(50) NOT NULL,
	CONSTRAINT "MedicalSpeciality_medicalSpecialityName_unique" UNIQUE("medicalSpecialityName")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."MedicalSpecialityMedicalProcedureMapping" (
	"medicalSpecialityId" varchar NOT NULL,
	"medicalProcedureId" varchar NOT NULL,
	CONSTRAINT "MedicalSpecialityMedicalProcedureMapping_medicalSpecialityId_medicalProcedureId_pk" PRIMARY KEY("medicalSpecialityId","medicalProcedureId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."Notification" (
	"notificationId" varchar PRIMARY KEY NOT NULL,
	"notificationSenderId" varchar(100) NOT NULL,
	"notificationAction" "notificationAction" NOT NULL,
	"notificationEntity" "notificationEntity" NOT NULL,
	"notificationBody" varchar(99999) NOT NULL,
	"notificationDateTime" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."Role" (
	"roleId" varchar PRIMARY KEY NOT NULL,
	"roleName" varchar(50) NOT NULL,
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
	"isUserSuspended" boolean DEFAULT false NOT NULL,
	"isUserBanned" boolean DEFAULT false NOT NULL,
	CONSTRAINT "User_userEmail_unique" UNIQUE("userEmail"),
	CONSTRAINT "User_userPhoneNumber_unique" UNIQUE("userPhoneNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."UserNotificationMapping" (
	"receiverId" varchar NOT NULL,
	"notificationId" varchar NOT NULL,
	"isNotificationRead" boolean DEFAULT false NOT NULL,
	CONSTRAINT "UserNotificationMapping_receiverId_notificationId_pk" PRIMARY KEY("receiverId","notificationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."UserPreferencesMapping" (
	"userId" varchar NOT NULL,
	"languageId" varchar NOT NULL,
	"isDarkModeOn" boolean NOT NULL,
	CONSTRAINT "UserPreferencesMapping_userId_pk" PRIMARY KEY("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iatropolis"."UserRoleMapping" (
	"userId" varchar NOT NULL,
	"roleId" varchar NOT NULL,
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
 ALTER TABLE "iatropolis"."DoctorMedicalSpecialityMapping" ADD CONSTRAINT "DoctorMedicalSpecialityMapping_userId_User_userId_fk" FOREIGN KEY ("userId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "iatropolis"."Notification" ADD CONSTRAINT "Notification_notificationSenderId_User_userId_fk" FOREIGN KEY ("notificationSenderId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."UserNotificationMapping" ADD CONSTRAINT "UserNotificationMapping_receiverId_User_userId_fk" FOREIGN KEY ("receiverId") REFERENCES "iatropolis"."User"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iatropolis"."UserNotificationMapping" ADD CONSTRAINT "UserNotificationMapping_notificationId_Notification_notificationId_fk" FOREIGN KEY ("notificationId") REFERENCES "iatropolis"."Notification"("notificationId") ON DELETE no action ON UPDATE no action;
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
