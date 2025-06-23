import feedbackData from '../mockData/feedback.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let feedback = [...feedbackData];

export const feedbackService = {
  async getAll() {
    await delay(300);
    return [...feedback];
  },

  async getById(id) {
    await delay(200);
    const feedbackItem = feedback.find(f => f.Id === parseInt(id, 10));
    if (!feedbackItem) {
      throw new Error('Feedback not found');
    }
    return { ...feedbackItem };
  },

  async create(feedbackData) {
    await delay(400);
    const newFeedback = {
      ...feedbackData,
      Id: Math.max(...feedback.map(f => f.Id)) + 1,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    feedback.push(newFeedback);
    return { ...newFeedback };
  },

  async update(id, updateData) {
    await delay(300);
    const index = feedback.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Feedback not found');
    }
    
    const updatedFeedback = {
      ...feedback[index],
      ...updateData,
      Id: feedback[index].Id // Prevent Id modification
    };
    
    feedback[index] = updatedFeedback;
    return { ...updatedFeedback };
  },

  async delete(id) {
    await delay(250);
    const index = feedback.findIndex(f => f.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Feedback not found');
    }
    
    const deletedFeedback = feedback[index];
    feedback.splice(index, 1);
    return { ...deletedFeedback };
  },

  async getByDoctor(doctorId) {
    await delay(200);
    return feedback.filter(f => f.doctorId === parseInt(doctorId, 10));
  },

  async getByPatient(patientId) {
    await delay(200);
    return feedback.filter(f => f.patientId === parseInt(patientId, 10));
  },

  async approve(id) {
    await delay(200);
    return this.update(id, { status: 'approved' });
  },

  async reject(id) {
    await delay(200);
    return this.update(id, { status: 'rejected' });
  },

  async getStats() {
    await delay(200);
    const approved = feedback.filter(f => f.status === 'approved');
    const pending = feedback.filter(f => f.status === 'pending');
    const averageRating = approved.length > 0 
      ? approved.reduce((sum, f) => sum + f.rating, 0) / approved.length 
      : 0;

    return {
      total: feedback.length,
      approved: approved.length,
      pending: pending.length,
      rejected: feedback.filter(f => f.status === 'rejected').length,
      averageRating: Math.round(averageRating * 10) / 10
    };
  }
};

export default feedbackService;