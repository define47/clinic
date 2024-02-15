import { FastifyReply, FastifyRequest } from "fastify";
import { MedicalRecordPatientService } from "../services/medicalRecordPatient.service";
import { AppointmentService } from "../services/appointment.service";

export class MedicalRecordPatientController {
  private readonly _medicalRecordPatientService: MedicalRecordPatientService;
  private readonly _appointmentService: AppointmentService;

  public constructor() {
    this._medicalRecordPatientService = new MedicalRecordPatientService();
    this._appointmentService = new AppointmentService();
  }

  public getMedicalRecordPatient = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const query: any = request.query;

      console.log(query);

      const medicalRecordPatient =
        await this._medicalRecordPatientService.getMedicalRecordPatientByAppointmentId(
          query.appointmentId
        );

      reply.code(200).send({
        success: medicalRecordPatient !== undefined,
        payload: medicalRecordPatient,
        // success: true,
        // message: "sent",
        // a: body.appointmentId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  public postMedicalRecordPatient = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      const medicalRecordPatientToCreate =
        await this._medicalRecordPatientService.createMedicalRecordPatient({
          appointmentId: body.appointmentId,
          symptoms: body.symptoms,
          conductedTests: body.conductedTests,
          diagnosis: body.diagnosis,
          recommendations: body.recommendations,
        });

      const currentAppointment =
        await this._appointmentService.getAppointmentById(body.appointmentId);
      console.log(currentAppointment);

      const appointmentToUpdated =
        await this._appointmentService.updateAppointment(body.appointmentId, {
          appointmentDateTime: currentAppointment.appointmentDateTime,
          appointmentReason: currentAppointment.appointmentReason,
          appointmentStatus: "completed",
          appointmentCancellationReason:
            currentAppointment.appointmentCancellationReason,
        });

      reply.code(200).send({ medicalRecordPatientToCreate });
    } catch (error) {}
  };

  public putMedicalRecordPatient = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      const medicalRecordPatientToUpdate =
        await this._medicalRecordPatientService.updateMedicalRecordPatient(
          body.appointmentId,
          {
            symptoms: body.symptoms,
            conductedTests: body.conductedTests,
            diagnosis: body.diagnosis,
            recommendations: body.recommendations,
          }
        );

      reply
        .code(200)
        .send({ medicalRecordPatientToCreate: medicalRecordPatientToUpdate });
    } catch (error) {}
  };

  public deleteMedicalRecordPatient = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const body: any = request.body;

      const medicalRecordPatientToDelete =
        await this._medicalRecordPatientService.deleteMedicalRecordPatient(
          body.appointmentId
        );

      reply.code(200).send({ medicalRecordPatientToDelete });
    } catch (error) {}
  };
}
