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
import patientService from '@/services/api/patientService';
import ApperIcon from '../ApperIcon';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchQuery]);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError(err.message || 'Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchQuery) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.phone.includes(query) ||
      patient.bloodType?.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  };

  const handleDeletePatient = async (patient) => {
    if (!window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      return;
    }

    try {
      await patientService.delete(patient.Id);
      setPatients(prev => prev.filter(p => p.Id !== patient.Id));
      toast.success('Patient deleted successfully');
    } catch (err) {
      toast.error('Failed to delete patient');
    }
  };

  const handleEditPatient = (patient) => {
    toast.info('Edit functionality would open here');
  };

  const handleViewHistory = (patient) => {
    toast.info(`View medical history for ${patient.name}`);
  };

  const getAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const columns = [
    {
      key: 'name',
      title: 'Patient',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-surface-900 truncate">{value}</p>
            <p className="text-sm text-surface-600 truncate">{item.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'dateOfBirth',
      title: 'Age / DOB',
      sortable: true,
      render: (value, item) => (
        <div>
          <p className="font-medium text-surface-900">{getAge(value)} years</p>
          <p className="text-sm text-surface-600">
            {value ? format(new Date(value), 'MMM dd, yyyy') : 'N/A'}
          </p>
        </div>
      )
    },
    {
      key: 'gender',
      title: 'Gender',
      sortable: true
    },
    {
      key: 'bloodType',
      title: 'Blood Type',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          {value || 'Unknown'}
        </span>
      )
    },
    {
      key: 'phone',
      title: 'Contact',
      sortable: false,
      render: (value, item) => (
        <div>
          <p className="text-sm text-surface-900">{value}</p>
          <p className="text-xs text-surface-600 truncate">{item.emergencyContact?.name}</p>
        </div>
      )
    },
    {
      key: 'lastVisit',
      title: 'Last Visit',
      sortable: true,
      render: (value) => (
        <div>
          <p className="text-sm text-surface-900">
            {value ? format(new Date(value), 'MMM dd, yyyy') : 'Never'}
          </p>
          <p className="text-xs text-surface-600">
            {value ? format(new Date(value), 'h:mm a') : ''}
          </p>
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
      label: 'History',
      icon: 'FileText',
      onClick: handleViewHistory
    },
    {
      label: 'Edit',
      icon: 'Edit2',
      onClick: handleEditPatient
    },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: handleDeletePatient
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
            <h1 className="text-2xl font-bold text-surface-900">Patients</h1>
            <p className="text-surface-600 mt-1">Manage patient records</p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadPatients} />
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Patients</h1>
            <p className="text-surface-600 mt-1">Manage patient records</p>
          </div>
          <Button icon="UserPlus">
            Add Patient
          </Button>
        </div>
        <EmptyState
          icon="Users"
          title="No patients found"
          description="Get started by registering your first patient in the system."
          actionLabel="Register First Patient"
          onAction={() => toast.info('Add patient form would open here')}
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
          <h1 className="text-2xl font-bold text-surface-900">Patients</h1>
          <p className="text-surface-600 mt-1">Manage patient records ({patients.length} total)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Download">
            Export
          </Button>
          <Button icon="UserPlus">
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search patients by name, email, phone, or blood type..."
            onSearch={setSearchQuery}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon="Filter">
            Filter
          </Button>
          <Button variant="outline" icon="SortAsc">
            Sort
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: patients.length, icon: 'Users', color: 'primary' },
          { label: 'Active', value: patients.filter(p => p.status === 'active').length, icon: 'UserCheck', color: 'success' },
          { label: 'New This Month', value: patients.filter(p => {
            const lastVisit = p.lastVisit ? new Date(p.lastVisit) : null;
            const thisMonth = new Date();
            thisMonth.setDate(1);
            return lastVisit && lastVisit >= thisMonth;
          }).length, icon: 'TrendingUp', color: 'accent' },
          { label: 'Critical Cases', value: patients.filter(p => p.medicalHistory && p.medicalHistory.length > 1).length, icon: 'AlertTriangle', color: 'warning' }
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

      {/* Patients Table */}
      <DataTable
        columns={columns}
        data={filteredPatients}
        actions={actions}
        onRowClick={(patient) => toast.info(`View details for ${patient.name}`)}
      />

      {/* Results Info */}
      {searchQuery && (
        <div className="text-sm text-surface-600">
          Showing {filteredPatients.length} of {patients.length} patients
          {filteredPatients.length === 0 && (
            <span className="ml-2 text-surface-500">
              - Try adjusting your search terms
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Patients;