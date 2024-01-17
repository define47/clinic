import { FastifyReply, FastifyRequest } from "fastify";
import { MedicalRecordPatientService } from "../services/medicalRecordPatient.service";

export class MedicalRecordPatientController {
  private readonly _medicalRecordPatientService: MedicalRecordPatientService;

  public constructor() {
    this._medicalRecordPatientService = new MedicalRecordPatientService();
  }

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
            medicalRecordPatientUpdatedAt: new Date(),
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
