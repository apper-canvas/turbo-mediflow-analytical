import billsData from '../mockData/bills.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let bills = [...billsData];

export const billService = {
  async getAll() {
    await delay(300);
    return [...bills];
  },

  async getById(id) {
    await delay(200);
    const bill = bills.find(b => b.Id === parseInt(id, 10));
    if (!bill) {
      throw new Error('Bill not found');
    }
    return { ...bill };
  },

  async create(billData) {
    await delay(400);
    const subtotal = billData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    const newBill = {
      ...billData,
      Id: Math.max(...bills.map(b => b.Id)) + 1,
      subtotal,
      tax,
      total,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    };
    bills.push(newBill);
    return { ...newBill };
  },

  async update(id, updateData) {
    await delay(300);
    const index = bills.findIndex(b => b.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Bill not found');
    }
    
    let updatedBill = {
      ...bills[index],
      ...updateData,
      Id: bills[index].Id // Prevent Id modification
    };

    // Recalculate totals if items changed
    if (updateData.items) {
      const subtotal = updateData.items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;
      updatedBill = { ...updatedBill, subtotal, tax, total };
    }
    
    bills[index] = updatedBill;
    return { ...updatedBill };
  },

  async delete(id) {
    await delay(250);
    const index = bills.findIndex(b => b.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Bill not found');
    }
    
    const deletedBill = bills[index];
    bills.splice(index, 1);
    return { ...deletedBill };
  },

  async getByPatient(patientId) {
    await delay(200);
    return bills.filter(b => b.patientId === parseInt(patientId, 10));
  },

  async updateStatus(id, status) {
    const updateData = { status };
    if (status === 'paid') {
      updateData.paidAt = new Date().toISOString().split('T')[0];
    }
    return this.update(id, updateData);
  },

  async getOverdue() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    return bills.filter(b => b.status === 'pending' && b.dueDate < today);
  }
};

export default billService;