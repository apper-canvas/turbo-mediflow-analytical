import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Button from '../atoms/Button';
import SearchBar from '../molecules/SearchBar';
import DataTable from '../molecules/DataTable';
import EmptyState from '../molecules/EmptyState';
import ErrorState from '../molecules/ErrorState';
import StatusBadge from '../atoms/StatusBadge';
import Card from '../atoms/Card';
import prescriptionService from '@/services/api/prescriptionService';
import ApperIcon from '../ApperIcon';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [prescriptions, searchQuery]);

  const loadPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await prescriptionService.getAll();
      setPrescriptions(data);
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions');
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const filterPrescriptions = () => {
    if (!searchQuery) {
      setFilteredPrescriptions(prescriptions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = prescriptions.filter(prescription =>
      prescription.patientName.toLowerCase().includes(query) ||
      prescription.doctorName.toLowerCase().includes(query) ||
      prescription.medicines.some(med => med.name.toLowerCase().includes(query))
    );
    setFilteredPrescriptions(filtered);
  };

  const handleDeletePrescription = async (prescription) => {
    if (!window.confirm(`Are you sure you want to delete this prescription for ${prescription.patientName}?`)) {
      return;
    }

    try {
      await prescriptionService.delete(prescription.Id);
      setPrescriptions(prev => prev.filter(p => p.Id !== prescription.Id));
      toast.success('Prescription deleted successfully');
    } catch (err) {
      toast.error('Failed to delete prescription');
    }
  };

  const handleEditPrescription = (prescription) => {
    toast.info('Edit functionality would open here');
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handlePrintPrescription = (prescription) => {
    toast.success(`Printing prescription for ${prescription.patientName}`);
  };

  const columns = [
    {
      key: 'createdAt',
      title: 'Date',
      sortable: true,
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'patientName',
      title: 'Patient',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={14} className="text-white" />
          </div>
          <span className="font-medium text-surface-900">{value}</span>
        </div>
      )
    },
    {
      key: 'doctorName',
      title: 'Prescribed By',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="UserCheck" size={14} className="text-white" />
          </div>
          <span className="font-medium text-surface-900">{value}</span>
        </div>
      )
    },
    {
      key: 'medicines',
      title: 'Medications',
      sortable: false,
      render: (value) => (
        <div>
          <p className="font-medium text-surface-900">{value.length} medication{value.length !== 1 ? 's' : ''}</p>
          <p className="text-sm text-surface-600 truncate">{value[0]?.name} {value[0]?.dosage}</p>
          {value.length > 1 && (
            <p className="text-xs text-surface-500">+{value.length - 1} more</p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      type: 'status'
    }
  ];

  const actions = [
    {
      label: 'View',
      icon: 'Eye',
      onClick: handleViewPrescription
    },
    {
      label: 'Print',
      icon: 'Printer',
      onClick: handlePrintPrescription
    },
    {
      label: 'Edit',
      icon: 'Edit2',
      onClick: handleEditPrescription
    },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: handleDeletePrescription
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-8 bg-surface-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-surface-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>
        <DataTable columns={columns} data={[]} loading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Prescriptions</h1>
            <p className="text-surface-600 mt-1">Manage medical prescriptions</p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadPrescriptions} />
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Prescriptions</h1>
            <p className="text-surface-600 mt-1">Manage medical prescriptions</p>
          </div>
          <Button icon="Plus">
            New Prescription
          </Button>
        </div>
        <EmptyState
          icon="FileText"
          title="No prescriptions found"
          description="Get started by creating your first prescription."
          actionLabel="Create First Prescription"
          onAction={() => toast.info('Create prescription form would open here')}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Prescriptions</h1>
          <p className="text-surface-600 mt-1">Manage medical prescriptions ({prescriptions.length} total)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Download">
            Export
          </Button>
          <Button icon="Plus">
            New Prescription
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Prescriptions', 
            value: prescriptions.length, 
            icon: 'FileText', 
            color: 'primary' 
          },
          { 
            label: 'Active', 
            value: prescriptions.filter(p => p.status === 'active').length, 
            icon: 'CheckCircle', 
            color: 'success' 
          },
          { 
            label: 'This Week', 
            value: prescriptions.filter(p => {
              const prescDate = new Date(p.createdAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return prescDate >= weekAgo;
            }).length, 
            icon: 'Calendar', 
            color: 'accent' 
          },
          { 
            label: 'Unique Medications', 
            value: new Set(prescriptions.flatMap(p => p.medicines.map(m => m.name))).size, 
            icon: 'Pill', 
            color: 'warning' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg border border-surface-200"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                ${stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                  stat.color === 'success' ? 'bg-green-100 text-green-600' :
                  stat.color === 'accent' ? 'bg-accent/10 text-accent' :
                  'bg-yellow-100 text-yellow-600'}
              `}>
                <ApperIcon name={stat.icon} size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                <p className="text-sm text-surface-600">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescriptions Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <SearchBar
            placeholder="Search prescriptions by patient, doctor, or medication..."
            onSearch={setSearchQuery}
          />

          {/* Table */}
          <DataTable
            columns={columns}
            data={filteredPrescriptions}
            actions={actions}
            onRowClick={handleViewPrescription}
          />

          {/* Results Info */}
          {searchQuery && (
            <div className="text-sm text-surface-600">
              Showing {filteredPrescriptions.length} of {prescriptions.length} prescriptions
            </div>
          )}
        </div>

        {/* Prescription Details */}
        <div className="space-y-6">
          {selectedPrescription ? (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900">Prescription Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setSelectedPrescription(null)}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-surface-700">Patient</label>
                  <p className="text-surface-900">{selectedPrescription.patientName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-surface-700">Prescribed By</label>
                  <p className="text-surface-900">{selectedPrescription.doctorName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-surface-700">Date</label>
                  <p className="text-surface-900">{format(new Date(selectedPrescription.createdAt), 'MMMM dd, yyyy')}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-surface-700">Medications</label>
                  <div className="space-y-3 mt-2">
                    {selectedPrescription.medicines.map((medicine, index) => (
                      <div key={index} className="p-3 bg-surface-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-surface-900">{medicine.name}</p>
                            <p className="text-sm text-surface-600">{medicine.dosage} - {medicine.frequency}</p>
                            <p className="text-sm text-surface-600">Duration: {medicine.duration}</p>
                          </div>
                          <ApperIcon name="Pill" size={16} className="text-surface-400 mt-1" />
                        </div>
                        {medicine.instructions && (
                          <p className="text-xs text-surface-500 mt-2 italic">{medicine.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPrescription.instructions && (
                  <div>
                    <label className="text-sm font-medium text-surface-700">General Instructions</label>
                    <p className="text-sm text-surface-600 mt-1 p-3 bg-blue-50 rounded-lg">
                      {selectedPrescription.instructions}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    icon="Printer"
                    onClick={() => handlePrintPrescription(selectedPrescription)}
                    className="flex-1"
                  >
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Edit2"
                    onClick={() => handleEditPrescription(selectedPrescription)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-8">
                <ApperIcon name="FileText" size={48} className="text-surface-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">Select a Prescription</h3>
                <p className="text-surface-600">Click on any prescription from the list to view details.</p>
              </div>
            </Card>
          )}

          {/* Common Medications */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Most Prescribed</h3>
            <div className="space-y-2">
              {[
                { name: 'Ibuprofen', count: 12, color: 'bg-blue-100 text-blue-800' },
                { name: 'Amoxicillin', count: 8, color: 'bg-green-100 text-green-800' },
                { name: 'Lisinopril', count: 6, color: 'bg-purple-100 text-purple-800' },
                { name: 'Metformin', count: 5, color: 'bg-orange-100 text-orange-800' }
              ].map((med, index) => (
                <div key={med.name} className="flex items-center justify-between">
                  <span className="text-sm text-surface-900">{med.name}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${med.color}`}>
                    {med.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Prescriptions;