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
}
