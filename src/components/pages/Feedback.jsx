import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import SearchBar from '../molecules/SearchBar';
import DataTable from '../molecules/DataTable';
import EmptyState from '../molecules/EmptyState';
import ErrorState from '../molecules/ErrorState';
import StatusBadge from '../atoms/StatusBadge';
import Card from '../atoms/Card';
import feedbackService from '@/services/api/feedbackService';
import ApperIcon from '../ApperIcon';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadFeedback();
    loadStats();
  }, []);

  useEffect(() => {
    filterFeedback();
  }, [feedback, searchQuery, statusFilter]);

  const loadFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getAll();
      setFeedback(data);
    } catch (err) {
      setError(err.message || 'Failed to load feedback');
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await feedbackService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const filterFeedback = () => {
    let filtered = [...feedback];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.patientName.toLowerCase().includes(query) ||
        item.doctorName.toLowerCase().includes(query) ||
        item.serviceType.toLowerCase().includes(query) ||
        item.comments.toLowerCase().includes(query)
      );
    }

    setFilteredFeedback(filtered);
  };

  const handleApproveFeedback = async (feedbackItem) => {
    try {
      await feedbackService.approve(feedbackItem.Id);
      setFeedback(prev => 
        prev.map(f => f.Id === feedbackItem.Id ? { ...f, status: 'approved' } : f)
      );
      loadStats();
      toast.success('Feedback approved successfully');
    } catch (err) {
      toast.error('Failed to approve feedback');
    }
  };

  const handleRejectFeedback = async (feedbackItem) => {
    if (!window.confirm('Are you sure you want to reject this feedback?')) {
      return;
    }

    try {
      await feedbackService.reject(feedbackItem.Id);
      setFeedback(prev => 
        prev.map(f => f.Id === feedbackItem.Id ? { ...f, status: 'rejected' } : f)
      );
      loadStats();
      toast.success('Feedback rejected');
    } catch (err) {
      toast.error('Failed to reject feedback');
    }
  };

  const handleDeleteFeedback = async (feedbackItem) => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    try {
      await feedbackService.delete(feedbackItem.Id);
      setFeedback(prev => prev.filter(f => f.Id !== feedbackItem.Id));
      loadStats();
      toast.success('Feedback deleted successfully');
    } catch (err) {
      toast.error('Failed to delete feedback');
    }
  };

  const renderRating = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <ApperIcon
          key={star}
          name="Star"
          size={14}
          className={
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-surface-300'
          }
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  );

  const columns = [
    {
      key: 'patientName',
      title: 'Patient',
      sortable: true,
      render: (value, item) => (
        <div>
          <p className="font-medium text-surface-900">{value}</p>
          <p className="text-sm text-surface-600">{item.dateOfService}</p>
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
          <p className="text-sm text-surface-600">{item.serviceType}</p>
        </div>
      )
    },
    {
      key: 'rating',
      title: 'Rating',
      sortable: true,
      render: renderRating
    },
    {
      key: 'comments',
      title: 'Comments',
      sortable: false,
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-surface-700 truncate" title={value}>
            {value}
          </p>
        </div>
      )
    },
    {
      key: 'submittedDate',
      title: 'Submitted',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-surface-600">{value}</span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      type: 'status'
    }
  ];

  const getActions = (item) => {
    const actions = [];
    
    if (item.status === 'pending') {
      actions.push(
        {
          label: 'Approve',
          icon: 'Check',
          onClick: () => handleApproveFeedback(item),
          className: 'text-green-600 hover:text-green-700'
        },
        {
          label: 'Reject',
          icon: 'X',
          onClick: () => handleRejectFeedback(item),
          className: 'text-red-600 hover:text-red-700'
        }
      );
    }
    
    actions.push({
      label: 'Delete',
      icon: 'Trash2',
      onClick: () => handleDeleteFeedback(item),
      className: 'text-red-600 hover:text-red-700'
    });
    
    return actions;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-8 bg-surface-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-surface-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="h-16 bg-surface-200 rounded"></div>
            </Card>
          ))}
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
            <h1 className="text-2xl font-bold text-surface-900">Patient Feedback</h1>
            <p className="text-surface-600 mt-1">Manage patient reviews and ratings</p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadFeedback} />
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Patient Feedback</h1>
            <p className="text-surface-600 mt-1">Manage patient reviews and ratings</p>
          </div>
        </div>
        <EmptyState
          icon="MessageCircle"
          title="No feedback found"
          description="Patient feedback will appear here once they start submitting reviews."
          actionLabel="Refresh"
          onAction={loadFeedback}
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
          <h1 className="text-2xl font-bold text-surface-900">Patient Feedback</h1>
          <p className="text-surface-600 mt-1">Manage patient reviews and ratings ({feedback.length} total)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Download">
            Export
          </Button>
          <Button variant="outline" icon="RefreshCw" onClick={loadFeedback}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="MessageCircle" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-600">Total Feedback</p>
                <p className="text-2xl font-bold text-surface-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Check" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-600">Approved</p>
                <p className="text-2xl font-bold text-surface-900">{stats.approved}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-600">Pending</p>
                <p className="text-2xl font-bold text-surface-900">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="X" size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-600">Rejected</p>
                <p className="text-2xl font-bold text-surface-900">{stats.rejected}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Star" size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-600">Avg Rating</p>
                <p className="text-2xl font-bold text-surface-900">{stats.averageRating}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search feedback by patient, doctor, service, or comments..."
            onSearch={setSearchQuery}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button variant="outline" icon="Filter">
            More Filters
          </Button>
        </div>
      </div>

      {/* Feedback Table */}
      <DataTable
        columns={columns}
        data={filteredFeedback}
        actions={getActions}
        onRowClick={(item) => toast.info(`Viewing feedback from ${item.patientName}`)}
      />

      {/* Results Info */}
      {(searchQuery || statusFilter !== 'all') && (
        <div className="text-sm text-surface-600">
          Showing {filteredFeedback.length} of {feedback.length} feedback entries
          {filteredFeedback.length === 0 && (
            <span className="ml-2 text-surface-500">
              - Try adjusting your search terms or filters
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Feedback;