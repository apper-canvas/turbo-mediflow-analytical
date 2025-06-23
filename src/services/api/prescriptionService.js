import prescriptionsData from '../mockData/prescriptions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let prescriptions = [...prescriptionsData];

export const prescriptionService = {
  async getAll() {
    await delay(300);
    return [...prescriptions];
  },

  async getById(id) {
    await delay(200);
    const prescription = prescriptions.find(p => p.Id === parseInt(id, 10));
    if (!prescription) {
      throw new Error('Prescription not found');
    }
    return { ...prescription };
  },

  async create(prescriptionData) {
    await delay(400);
    const newPrescription = {
      ...prescriptionData,
      Id: Math.max(...prescriptions.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    prescriptions.push(newPrescription);
    return { ...newPrescription };
  },

  async update(id, updateData) {
    await delay(300);
    const index = prescriptions.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Prescription not found');
    }
    
    const updatedPrescription = {
      ...prescriptions[index],
      ...updateData,
      Id: prescriptions[index].Id // Prevent Id modification
    };
    
    prescriptions[index] = updatedPrescription;
    return { ...updatedPrescription };
  },

  async delete(id) {
    await delay(250);
    const index = prescriptions.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Prescription not found');
    }
    
    const deletedPrescription = prescriptions[index];
    prescriptions.splice(index, 1);
    return { ...deletedPrescription };
  },

  async getByPatient(patientId) {
    await delay(200);
    return prescriptions.filter(p => p.patientId === parseInt(patientId, 10));
  },

  async getByDoctor(doctorId) {
    await delay(200);
    return prescriptions.filter(p => p.doctorId === parseInt(doctorId, 10));
  },

  async getByAppointment(appointmentId) {
    await delay(200);
    return prescriptions.filter(p => p.appointmentId === parseInt(appointmentId, 10));
  }
};

export default prescriptionService;