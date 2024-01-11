import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { medicalRecordPatientController } from "../controllers";

export async function medicalRecordPatientRoutes(
  fastifyServer: FastifyInstance
) {
  fastifyServer.post(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalRecordPatientController.postMedicalRecordPatient(
        request,
        reply
      );
    }
  );

  fastifyServer.put(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalRecordPatientController.putMedicalRecordPatient(
        request,
        reply
      );
    }
  );

  fastifyServer.delete(
    "/",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await medicalRecordPatientController.deleteMedicalRecordPatient(
        request,
        reply
      );
    }
  );
}
