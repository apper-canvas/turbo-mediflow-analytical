import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../molecules/StatCard';
import doctorService from '@/services/api/doctorService';
import patientService from '@/services/api/patientService';
import appointmentService from '@/services/api/appointmentService';
import billService from '@/services/api/billService';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    todayAppointments: 0,
    pendingBills: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [doctors, patients, appointments, bills] = await Promise.all([
          doctorService.getAll(),
          patientService.getAll(),
          appointmentService.getAll(),
          billService.getAll()
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(apt => apt.date === today);
        const pendingBills = bills.filter(bill => bill.status === 'pending');

        setStats({
          doctors: doctors.length,
          patients: patients.length,
          todayAppointments: todayAppointments.length,
          pendingBills: pendingBills.length
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsConfig = [
    {
      title: "Active Doctors",
      value: stats.doctors,
      icon: "UserCheck",
      color: "primary",
      trend: "up",
      trendValue: "+2 this month"
    },
    {
      title: "Total Patients",
      value: stats.patients,
      icon: "Users",
      color: "secondary",
      trend: "up",
      trendValue: "+12 this week"
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: "Calendar",
      color: "accent",
      trend: "neutral",
      trendValue: "3 confirmed"
    },
    {
      title: "Pending Bills",
      value: stats.pendingBills,
      icon: "CreditCard",
      color: "warning",
      trend: "down",
      trendValue: "-5 from last week"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            trendValue={stat.trendValue}
            loading={loading}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;