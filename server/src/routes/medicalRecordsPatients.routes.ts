import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { medicalRecordPatientController } from "../controllers";

export async function medicalRecordsPatientsRoutes(
  fastifyServer: FastifyInstance
) {
  fastifyServer.get(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalRecordPatientController.getMedicalRecordsByPatientIdAndDoctorId(
        request,
        reply
      );
    }
  );
}
