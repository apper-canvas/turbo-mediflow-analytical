import appointmentsData from '../mockData/appointments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let appointments = [...appointmentsData];

export const appointmentService = {
  async getAll() {
    await delay(300);
    return [...appointments];
  },

  async getById(id) {
    await delay(200);
    const appointment = appointments.find(a => a.Id === parseInt(id, 10));
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return { ...appointment };
  },

  async create(appointmentData) {
    await delay(400);
    const newAppointment = {
      ...appointmentData,
      Id: Math.max(...appointments.map(a => a.Id)) + 1,
      status: 'scheduled'
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  async update(id, updateData) {
    await delay(300);
    const index = appointments.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    const updatedAppointment = {
      ...appointments[index],
      ...updateData,
      Id: appointments[index].Id // Prevent Id modification
    };
    
    appointments[index] = updatedAppointment;
    return { ...updatedAppointment };
  },

  async delete(id) {
    await delay(250);
    const index = appointments.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    const deletedAppointment = appointments[index];
    appointments.splice(index, 1);
    return { ...deletedAppointment };
  },

  async getByDate(date) {
    await delay(200);
    return appointments.filter(a => a.date === date);
  },

  async getByPatient(patientId) {
    await delay(200);
    return appointments.filter(a => a.patientId === parseInt(patientId, 10));
  },

  async getByDoctor(doctorId) {
    await delay(200);
    return appointments.filter(a => a.doctorId === parseInt(doctorId, 10));
  },

  async updateStatus(id, status) {
    return this.update(id, { status });
  }
};

export default appointmentService;