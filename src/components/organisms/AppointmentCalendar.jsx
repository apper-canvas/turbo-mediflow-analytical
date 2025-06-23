import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';
import StatusBadge from '../atoms/StatusBadge';
import appointmentService from '@/services/api/appointmentService';

const AppointmentCalendar = ({ onDateSelect, selectedDate = new Date() }) => {
  const [appointments, setAppointments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [currentMonth]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              onClick={() => navigateMonth(-1)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              onClick={() => navigateMonth(1)}
            />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-surface-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(day => {
            const dayAppointments = getAppointmentsForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDateSelect?.(day)}
                className={`
                  p-2 h-20 border rounded-lg text-left transition-all relative
                  ${isSelected 
                    ? 'bg-primary text-white border-primary' 
                    : isTodayDate
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-white border-surface-200 hover:bg-surface-50'
                  }
                `.trim()}
              >
                <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-surface-900'}`}>
                  {format(day, 'd')}
                </div>
                
                {dayAppointments.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayAppointments.slice(0, 3).map(apt => (
                      <div 
                        key={apt.Id}
                        className={`
                          text-xs px-1 py-0.5 rounded truncate
                          ${isSelected 
                            ? 'bg-white/20 text-white' 
                            : 'bg-primary/10 text-primary'
                          }
                        `.trim()}
                      >
                        {apt.time}
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className={`text-xs ${isSelected ? 'text-white' : 'text-surface-500'}`}>
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div>
          <h3 className="font-medium text-surface-900 mb-3">
            Appointments for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-2">
            {getAppointmentsForDate(selectedDate).map(apt => (
              <div key={apt.Id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                <div>
                  <p className="font-medium text-surface-900">{apt.patientName}</p>
                  <p className="text-sm text-surface-600">{apt.time} - {apt.doctorName}</p>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
            {getAppointmentsForDate(selectedDate).length === 0 && (
              <p className="text-surface-500 text-center py-4">No appointments scheduled</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AppointmentCalendar;