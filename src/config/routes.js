import Dashboard from '@/components/pages/Dashboard';
import Doctors from '@/components/pages/Doctors';
import Patients from '@/components/pages/Patients';
import Appointments from '@/components/pages/Appointments';
import Billing from '@/components/pages/Billing';
import Prescriptions from '@/components/pages/Prescriptions';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  doctors: {
    id: 'doctors',
    label: 'Doctors',
    path: '/doctors',
    icon: 'UserCheck',
    component: Doctors
  },
  patients: {
    id: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: 'Users',
    component: Patients
  },
  appointments: {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: 'Calendar',
    component: Appointments
  },
  billing: {
    id: 'billing',
    label: 'Billing',
    path: '/billing',
    icon: 'CreditCard',
    component: Billing
  },
  prescriptions: {
    id: 'prescriptions',
    label: 'Prescriptions',
    path: '/prescriptions',
    icon: 'FileText',
    component: Prescriptions
  }
};

export const routeArray = Object.values(routes);
export default routes;