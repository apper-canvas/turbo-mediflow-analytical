import patientsData from '../mockData/patients.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let patients = [...patientsData];

export const patientService = {
  async getAll() {
    await delay(300);
    return [...patients];
  },

  async getById(id) {
    await delay(200);
    const patient = patients.find(p => p.Id === parseInt(id, 10));
    if (!patient) {
      throw new Error('Patient not found');
    }
    return { ...patient };
  },

  async create(patientData) {
    await delay(400);
    const newPatient = {
      ...patientData,
      Id: Math.max(...patients.map(p => p.Id)) + 1,
      status: 'active',
      medicalHistory: patientData.medicalHistory || []
    };
    patients.push(newPatient);
    return { ...newPatient };
  },

  async update(id, updateData) {
    await delay(300);
    const index = patients.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Patient not found');
    }
    
    const updatedPatient = {
      ...patients[index],
      ...updateData,
      Id: patients[index].Id // Prevent Id modification
    };
    
    patients[index] = updatedPatient;
    return { ...updatedPatient };
  },

  async delete(id) {
    await delay(250);
    const index = patients.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Patient not found');
    }
    
    const deletedPatient = patients[index];
    patients.splice(index, 1);
    return { ...deletedPatient };
  },

  async search(query) {
    await delay(200);
    if (!query) return [...patients];
    
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.email.toLowerCase().includes(lowercaseQuery) ||
      p.phone.includes(query)
    );
  }
};

export default patientService;