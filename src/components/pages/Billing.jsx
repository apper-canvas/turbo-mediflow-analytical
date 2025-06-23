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
import billService from '@/services/api/billService';
import ApperIcon from '../ApperIcon';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [bills, searchQuery]);

  const loadBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billService.getAll();
      setBills(data);
    } catch (err) {
      setError(err.message || 'Failed to load bills');
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const filterBills = () => {
    if (!searchQuery) {
      setFilteredBills(bills);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = bills.filter(bill =>
      bill.patientName.toLowerCase().includes(query) ||
      bill.Id.toString().includes(query) ||
      bill.status.toLowerCase().includes(query)
    );
    setFilteredBills(filtered);
  };

  const handleUpdateStatus = async (bill, newStatus) => {
    try {
      const updated = await billService.updateStatus(bill.Id, newStatus);
      setBills(prev => prev.map(b => 
        b.Id === bill.Id ? { ...b, status: newStatus, ...(newStatus === 'paid' ? { paidAt: new Date().toISOString().split('T')[0] } : {}) } : b
      ));
      toast.success(`Bill marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update bill status');
    }
  };

  const handleDownloadBill = (bill) => {
    // Simulate PDF download
    toast.success(`Downloading bill #${bill.Id} for ${bill.patientName}`);
  };

  const handleSendBill = (bill) => {
    toast.success(`Bill sent to patient ${bill.patientName}`);
  };

  const handleDeleteBill = async (bill) => {
    if (!window.confirm(`Are you sure you want to delete bill #${bill.Id}?`)) {
      return;
    }

    try {
      await billService.delete(bill.Id);
      setBills(prev => prev.filter(b => b.Id !== bill.Id));
      toast.success('Bill deleted successfully');
    } catch (err) {
      toast.error('Failed to delete bill');
    }
  };

  const getTotalRevenue = () => {
    return bills
      .filter(bill => bill.status === 'paid')
      .reduce((sum, bill) => sum + bill.total, 0);
  };

  const getPendingAmount = () => {
    return bills
      .filter(bill => bill.status === 'pending')
      .reduce((sum, bill) => sum + bill.total, 0);
  };

  const getOverdueAmount = () => {
    return bills
      .filter(bill => bill.status === 'overdue')
      .reduce((sum, bill) => sum + bill.total, 0);
  };

  const columns = [
    {
      key: 'Id',
      title: 'Bill #',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm font-medium text-surface-900">
          #{value.toString().padStart(4, '0')}
        </span>
      )
    },
    {
      key: 'patientName',
      title: 'Patient',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={14} className="text-white" />
          </div>
          <span className="font-medium text-surface-900">{value}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Date',
      sortable: true,
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'items',
      title: 'Services',
      sortable: false,
      render: (value) => (
        <div>
          <p className="font-medium text-surface-900">{value.length} item{value.length !== 1 ? 's' : ''}</p>
          <p className="text-sm text-surface-600 truncate">{value[0]?.description}</p>
        </div>
      )
    },
    {
      key: 'total',
      title: 'Amount',
      sortable: true,
      type: 'currency',
      render: (value) => (
        <span className="font-semibold text-surface-900">
          ${value.toFixed(2)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      type: 'status'
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      sortable: true,
      render: (value, item) => {
        if (item.status === 'paid') {
          return (
            <span className="text-green-600 text-sm">
              Paid {item.paidAt ? format(new Date(item.paidAt), 'MMM dd') : ''}
            </span>
          );
        }
        if (!value) return '-';
        
        const isOverdue = new Date(value) < new Date() && item.status === 'pending';
        return (
          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-surface-600'}`}>
            {format(new Date(value), 'MMM dd, yyyy')}
          </span>
        );
      }
    }
  ];

  const actions = [
    {
      label: 'Download',
      icon: 'Download',
      onClick: handleDownloadBill
    },
    {
      label: 'Send',
      icon: 'Send',
      onClick: handleSendBill
    },
    {
      label: 'Delete',
      icon: 'Trash2',
      onClick: handleDeleteBill
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-surface-200 animate-pulse">
              <div className="h-4 bg-surface-200 rounded mb-2"></div>
              <div className="h-8 bg-surface-200 rounded mb-2"></div>
              <div className="h-3 bg-surface-200 rounded"></div>
            </div>
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
            <h1 className="text-2xl font-bold text-surface-900">Billing</h1>
            <p className="text-surface-600 mt-1">Manage invoices and payments</p>
          </div>
        </div>
        <ErrorState message={error} onRetry={loadBills} />
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Billing</h1>
            <p className="text-surface-600 mt-1">Manage invoices and payments</p>
          </div>
          <Button icon="Plus">
            Create Bill
          </Button>
        </div>
        <EmptyState
          icon="CreditCard"
          title="No bills found"
          description="Get started by creating your first bill or invoice."
          actionLabel="Create First Bill"
          onAction={() => toast.info('Create bill form would open here')}
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
          <h1 className="text-2xl font-bold text-surface-900">Billing</h1>
          <p className="text-surface-600 mt-1">Manage invoices and payments ({bills.length} total)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Download">
            Export
          </Button>
          <Button variant="outline" icon="FileText">
            Generate Report
          </Button>
          <Button icon="Plus">
            Create Bill
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Revenue', 
            value: `$${getTotalRevenue().toLocaleString()}`, 
            icon: 'DollarSign', 
            color: 'success',
            trend: 'up',
            trendValue: '+12.5%'
          },
          { 
            label: 'Pending Amount', 
            value: `$${getPendingAmount().toLocaleString()}`, 
            icon: 'Clock', 
            color: 'warning',
            trend: 'neutral',
            trendValue: `${bills.filter(b => b.status === 'pending').length} bills`
          },
          { 
            label: 'Overdue Amount', 
            value: `$${getOverdueAmount().toLocaleString()}`, 
            icon: 'AlertTriangle', 
            color: 'danger',
            trend: 'down',
            trendValue: `${bills.filter(b => b.status === 'overdue').length} bills`
          },
          { 
            label: 'This Month', 
            value: `$${bills.filter(b => {
              const billDate = new Date(b.createdAt);
              const thisMonth = new Date();
              return billDate.getMonth() === thisMonth.getMonth() && 
                     billDate.getFullYear() === thisMonth.getFullYear();
            }).reduce((sum, b) => sum + b.total, 0).toLocaleString()}`, 
            icon: 'Calendar', 
            color: 'primary',
            trend: 'up',
            trendValue: '+8.2%'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                  ${stat.color === 'success' ? 'bg-green-100 text-green-600' :
                    stat.color === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    stat.color === 'danger' ? 'bg-red-100 text-red-600' :
                    'bg-primary/10 text-primary'}
                `}>
                  <ApperIcon name={stat.icon} size={24} />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs font-medium
                    ${stat.trend === 'up' ? 'text-green-600' :
                      stat.trend === 'down' ? 'text-red-600' :
                      'text-surface-500'}
                  `}>
                    <ApperIcon 
                      name={stat.trend === 'up' ? 'TrendingUp' : stat.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                      size={14} 
                    />
                    {stat.trendValue}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-surface-900 mb-1">{stat.value}</div>
              <p className="text-sm text-surface-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search bills by patient name, bill number, or status..."
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

      {/* Bills Table */}
      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredBills}
          actions={actions}
          onRowClick={(bill) => toast.info(`View details for bill #${bill.Id}`)}
        />
      </div>

      {/* Quick Actions */}
      {filteredBills.length > 0 && (
        <Card>
          <h3 className="font-medium text-surface-900 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="accent" 
              size="sm"
              onClick={() => {
                const pendingBills = filteredBills.filter(b => b.status === 'pending');
                if (pendingBills.length > 0) {
                  toast.success(`Sent reminders for ${pendingBills.length} pending bills`);
                } else {
                  toast.info('No pending bills to send reminders for');
                }
              }}
            >
              Send Payment Reminders
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.success('Generating monthly billing report...')}
            >
              Generate Monthly Report
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const overdueBills = filteredBills.filter(b => b.status === 'overdue');
                if (overdueBills.length > 0) {
                  toast.info(`Found ${overdueBills.length} overdue bills`);
                } else {
                  toast.success('No overdue bills found');
                }
              }}
            >
              Check Overdue Bills
            </Button>
          </div>
        </Card>
      )}

      {/* Results Info */}
      {searchQuery && (
        <div className="text-sm text-surface-600">
          Showing {filteredBills.length} of {bills.length} bills
          {filteredBills.length === 0 && (
            <span className="ml-2 text-surface-500">
              - Try adjusting your search terms
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Billing;