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
import AppointmentCalendar from '../organisms/AppointmentCalendar';
import appointmentService from '@/services/api/appointmentService';
import ApperIcon from '../ApperIcon';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchQuery]);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    if (!searchQuery) {
      setFilteredAppointments(appointments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = appointments.filter(appointment =>
      appointment.patientName.toLowerCase().includes(query) ||
      appointment.doctorName.toLowerCase().includes(query) ||
      appointment.type.toLowerCase().includes(query) ||
      appointment.status.toLowerCase().includes(query)
    );
    setFilteredAppointments(filtered);
  };

  const handleUpdateStatus = async (appointment, newStatus) => {
    try {
      const updated = await appointmentService.updateStatus(appointment.Id, newStatus);
      setAppointments(prev => prev.map(apt => 
        apt.Id === appointment.Id ? { ...apt, status: newStatus } : apt
      ));
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (err) {
      toast.error('Failed to update appointment status');
    }
  };

  const handleDeleteAppointment = async (appointment) => {
    if (!window.confirm(`Are you sure you want to cancel this appointment with ${appointment.patientName}?`)) {
      return;
    }

    try {
      await appointmentService.delete(appointment.Id);
      setAppointments(prev => prev.filter(apt => apt.Id !== appointment.Id));
      toast.success('Appointment cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleEditAppointment = (appointment) => {
    toast.info('Edit functionality would open here');
  };

  const getStatusActions = (status) => {
    switch (status) {
      case 'scheduled':
        return [
          { label: 'Confirm', action: 'confirmed', variant: 'accent' },
          { label: 'Cancel', action: 'cancelled', variant: 'danger' }
        ];
      case 'confirmed':
        return [
          { label: 'Complete', action: 'completed', variant: 'success' },
          { label: 'Cancel', action: 'cancelled', variant: 'danger' }
        ];
      case 'completed':
        return [];
      case 'cancelled':
        return [
          { label: 'Reschedule', action: 'scheduled', variant: 'primary' }
        ];
      default:
        return [];
    }
  };

  const columns = [
    {
      key: 'date',
      title: 'Date & Time',
      sortable: true,
      render: (value, item) => (
        <div>
          <p className="font-medium text-surface-900">
            {format(new Date(value), 'MMM dd, yyyy')}
          </p>
          <p className="text-sm text-surface-600">{item.time}</p>
        </div>
      )
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
      title: 'Doctor',
      sortable: true,
      render: (value, item) => (
        <div>
          <p className="font-medium text-surface-900">{value}</p>
          <p className="text-sm text-surface-600">{item.specialization}</p>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {value}
        </span>
      )
    },
    {
      key: 'duration',
      title: 'Duration',
      sortable: true,
      render: (value) => `${value} min`
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
      onClick: handleEditAppointment
    },
    {
      label: 'Cancel',
      icon: 'X',
      onClick: handleDeleteAppointment
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
            <h1 className="text-2xl font-bold text-surface-900">Appointments</h1>
            <p className="text-surface-600 mt-1">Manage appointment scheduling</p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadAppointments} />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Appointments</h1>
            <p className="text-surface-600 mt-1">Manage appointment scheduling</p>
          </div>
          <Button icon="CalendarPlus">
            Schedule Appointment
          </Button>
        </div>
        <EmptyState
          icon="Calendar"
          title="No appointments scheduled"
          description="Get started by scheduling your first appointment."
          actionLabel="Schedule First Appointment"
          onAction={() => toast.info('Schedule appointment form would open here')}
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
          <h1 className="text-2xl font-bold text-surface-900">Appointments</h1>
          <p className="text-surface-600 mt-1">Manage appointment scheduling ({appointments.length} total)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white text-surface-900 shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="List" size={16} className="mr-2 inline" />
              Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white text-surface-900 shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="Calendar" size={16} className="mr-2 inline" />
              Calendar
            </button>
          </div>
          <Button variant="outline" icon="Download">
            Export
          </Button>
          <Button icon="CalendarPlus">
            New Appointment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Today', 
            value: appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length, 
            icon: 'Calendar', 
            color: 'primary' 
          },
          { 
            label: 'Confirmed', 
            value: appointments.filter(apt => apt.status === 'confirmed').length, 
            icon: 'CheckCircle', 
            color: 'success' 
          },
          { 
            label: 'Pending', 
            value: appointments.filter(apt => apt.status === 'scheduled').length, 
            icon: 'Clock', 
            color: 'warning' 
          },
          { 
            label: 'Completed', 
            value: appointments.filter(apt => apt.status === 'completed').length, 
            icon: 'Check', 
            color: 'accent' 
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
                  stat.color === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-accent/10 text-accent'}
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

      {/* Content based on view mode */}
      {viewMode === 'calendar' ? (
        <AppointmentCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search appointments by patient, doctor, or type..."
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

          {/* Appointments Table */}
          <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredAppointments}
              actions={actions}
              onRowClick={(appointment) => toast.info(`View details for appointment with ${appointment.patientName}`)}
            />
          </div>

          {/* Quick Actions for selected appointments */}
          {filteredAppointments.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-surface-200">
              <h3 className="font-medium text-surface-900 mb-3">Quick Status Updates</h3>
              <div className="flex flex-wrap gap-2">
                {filteredAppointments.slice(0, 3).map(appointment => (
                  <div key={appointment.Id} className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg">
                    <span className="text-sm text-surface-700 mr-2">
                      {appointment.patientName} - {appointment.time}
                    </span>
                    {getStatusActions(appointment.status).map(statusAction => (
                      <Button
                        key={statusAction.action}
                        variant={statusAction.variant}
                        size="xs"
                        onClick={() => handleUpdateStatus(appointment, statusAction.action)}
                      >
                        {statusAction.label}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Info */}
          {searchQuery && (
            <div className="text-sm text-surface-600">
              Showing {filteredAppointments.length} of {appointments.length} appointments
              {filteredAppointments.length === 0 && (
                <span className="ml-2 text-surface-500">
                  - Try adjusting your search terms
                </span>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Appointments;