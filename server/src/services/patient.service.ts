import {
  PatientCreationAttributes,
  PatientUpdateAttributes,
  patientTable,
} from "../models/patient.model";
import { PatientRepository } from "../repositories/patient.repository";
import { drizzleInstance } from "../utils/drizzle";

export class PatientService {
  private readonly _patientRepository: PatientRepository;

  public constructor() {
    this._patientRepository = new PatientRepository(
      drizzleInstance,
      patientTable
    );
  }

  public async createPatient(
    patientCreationAttributes: PatientCreationAttributes
  ) {
    return this._patientRepository.createPatient(patientCreationAttributes);
  }

  public async updatePatient(
    patientId: string,
    patientUpdateAttributes: PatientUpdateAttributes
  ) {
    return this._patientRepository.updatePatient(
      patientId,
      patientUpdateAttributes
    );
  }
}
