import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import SearchBar from '../molecules/SearchBar';
import DataTable from '../molecules/DataTable';
import EmptyState from '../molecules/EmptyState';
import ErrorState from '../molecules/ErrorState';
import StatusBadge from '../atoms/StatusBadge';
import doctorService from '@/services/api/doctorService';
import ApperIcon from '../ApperIcon';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery]);

  const loadDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getAll();
      setDoctors(data);
    } catch (err) {
      setError(err.message || 'Failed to load doctors');
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    if (!searchQuery) {
      setFilteredDoctors(doctors);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialization.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query)
    );
    setFilteredDoctors(filtered);
  };

  const handleDeleteDoctor = async (doctor) => {
    if (!window.confirm(`Are you sure you want to delete ${doctor.name}?`)) {
      return;
    }

    try {
      await doctorService.delete(doctor.Id);
      setDoctors(prev => prev.filter(d => d.Id !== doctor.Id));
      toast.success('Doctor deleted successfully');
    } catch (err) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleEditDoctor = (doctor) => {
    // In a real app, this would open an edit modal or navigate to edit page
    toast.info('Edit functionality would open here');
  };

  const columns = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-surface-900">{value}</p>
            <p className="text-sm text-surface-600">{item.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'specialization',
      title: 'Specialization',
      sortable: true
    },
    {
      key: 'phone',
      title: 'Phone',
      sortable: false
    },
    {
      key: 'patientCount',
      title: 'Patients',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <ApperIcon name="Users" size={14} className="text-surface-400" />
          <span>{value}</span>
        </div>
      )
    },
{
      key: 'yearsExperience',
      title: 'Experience',
      sortable: true,
      render: (value) => `${value} years`
    },
    {
      key: 'rating',
      title: 'Rating',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <ApperIcon
                key={star}
                name="Star"
                size={14}
                className={
                  star <= (value || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-surface-300'
                }
              />
            ))}
          </div>
          <span className="text-sm text-surface-600">
            ({item.reviewCount || 0})
          </span>
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
      label: 'Edit',
      icon: 'Edit2',
      onClick: handleEditDoctor
    },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: handleDeleteDoctor
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
            <h1 className="text-2xl font-bold text-surface-900">Doctors</h1>
            <p className="text-surface-600 mt-1">Manage your medical staff</p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadDoctors} />
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Doctors</h1>
            <p className="text-surface-600 mt-1">Manage your medical staff</p>
          </div>
          <Button icon="UserPlus">
            Add Doctor
          </Button>
        </div>
        <EmptyState
          icon="UserCheck"
          title="No doctors found"
          description="Get started by adding your first doctor to the system."
          actionLabel="Add First Doctor"
          onAction={() => toast.info('Add doctor form would open here')}
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
          <h1 className="text-2xl font-bold text-surface-900">Doctors</h1>
          <p className="text-surface-600 mt-1">Manage your medical staff ({doctors.length} total)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Download">
            Export
          </Button>
          <Button icon="UserPlus">
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search doctors by name, specialization, or email..."
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

      {/* Doctors Table */}
      <DataTable
        columns={columns}
        data={filteredDoctors}
        actions={actions}
        onRowClick={(doctor) => toast.info(`View details for ${doctor.name}`)}
      />

      {/* Results Info */}
      {searchQuery && (
        <div className="text-sm text-surface-600">
          Showing {filteredDoctors.length} of {doctors.length} doctors
          {filteredDoctors.length === 0 && (
            <span className="ml-2 text-surface-500">
              - Try adjusting your search terms
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Doctors;