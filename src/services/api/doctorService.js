import doctorsData from '../mockData/doctors.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let doctors = [...doctorsData];

export const doctorService = {
  async getAll() {
    await delay(300);
    return [...doctors];
  },

  async getById(id) {
    await delay(200);
    const doctor = doctors.find(d => d.Id === parseInt(id, 10));
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    return { ...doctor };
  },

  async create(doctorData) {
    await delay(400);
    const newDoctor = {
      ...doctorData,
      Id: Math.max(...doctors.map(d => d.Id)) + 1,
      patientCount: 0,
      status: 'active'
    };
    doctors.push(newDoctor);
    return { ...newDoctor };
  },

  async update(id, updateData) {
    await delay(300);
    const index = doctors.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Doctor not found');
    }
    
    const updatedDoctor = {
      ...doctors[index],
      ...updateData,
      Id: doctors[index].Id // Prevent Id modification
    };
    
    doctors[index] = updatedDoctor;
    return { ...updatedDoctor };
  },

  async delete(id) {
    await delay(250);
    const index = doctors.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Doctor not found');
    }
    
    const deletedDoctor = doctors[index];
    doctors.splice(index, 1);
    return { ...deletedDoctor };
  },
async getAvailable(date, time) {
    await delay(200);
    // Simple availability check - in real app would check appointments
    return doctors.filter(d => d.status === 'active');
  },

  async getRatings(doctorId) {
    await delay(200);
    // In real app, would fetch from feedback service
    // For now, return calculated rating from doctor data
    const doctor = doctors.find(d => d.Id === parseInt(doctorId, 10));
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    
    return {
      averageRating: doctor.rating || 0,
      totalReviews: doctor.reviewCount || 0
    };
  },

  async updateRating(doctorId, newRating, reviewCount) {
    await delay(200);
    const index = doctors.findIndex(d => d.Id === parseInt(doctorId, 10));
    if (index === -1) {
      throw new Error('Doctor not found');
    }
    
    doctors[index] = {
      ...doctors[index],
      rating: newRating,
      reviewCount: reviewCount
    };
    
    return { ...doctors[index] };
  }
};

export default doctorService;