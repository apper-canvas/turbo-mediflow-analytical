import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '../organisms/DashboardStats';
import AppointmentCalendar from '../organisms/AppointmentCalendar';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const quickActions = [
    {
      label: "New Patient",
      icon: "UserPlus",
      color: "primary",
      action: () => console.log("New Patient")
    },
    {
      label: "Schedule Appointment",
      icon: "CalendarPlus",
      color: "secondary",
      action: () => console.log("Schedule Appointment")
    },
    {
      label: "Generate Bill",
      icon: "FileText",
      color: "accent",
      action: () => console.log("Generate Bill")
    },
    {
      label: "View Reports",
      icon: "BarChart3",
      color: "warning",
      action: () => console.log("View Reports")
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" icon="Download">
            Export Data
          </Button>
          <Button icon="Plus">
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <AppointmentCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="p-3 border border-surface-200 rounded-lg hover:bg-surface-50 transition-all text-left"
                >
                  <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center
                    ${action.color === 'primary' ? 'bg-primary/10 text-primary' :
                      action.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                      action.color === 'accent' ? 'bg-accent/10 text-accent' :
                      'bg-yellow-100 text-yellow-600'}
                  `}>
                    <ApperIcon name={action.icon} size={16} />
                  </div>
                  <p className="text-sm font-medium text-surface-900">{action.label}</p>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                {
                  icon: "UserCheck",
                  title: "New patient registered",
                  subtitle: "Emily Davis - 2 hours ago",
                  color: "text-green-600 bg-green-100"
                },
                {
                  icon: "Calendar",
                  title: "Appointment scheduled",
                  subtitle: "John Smith with Dr. Johnson - 3 hours ago",
                  color: "text-blue-600 bg-blue-100"
                },
                {
                  icon: "FileText",
                  title: "Bill generated",
                  subtitle: "Invoice #1234 for $334.80 - 5 hours ago",
                  color: "text-purple-600 bg-purple-100"
                },
                {
                  icon: "Pill",
                  title: "Prescription issued",
                  subtitle: "Dr. Wilson prescribed medication - 6 hours ago",
                  color: "text-orange-600 bg-orange-100"
                }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                    <ApperIcon name={activity.icon} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 text-sm">{activity.title}</p>
                    <p className="text-surface-600 text-xs">{activity.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;