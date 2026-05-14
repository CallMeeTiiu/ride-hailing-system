import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme'; 
import { useTheme } from '../../contexts/ThemeContext'; 

interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  selectedDate?: string;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ 
  visible, 
  onClose, 
  onSelectDate, 
  selectedDate 
}) => {
  const { colors } = useTheme();
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const getDaysInMonth = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const handleDatePress = (day: number) => {
    const formattedDate = `${currentMonth + 1}/${day}/${currentYear}`;
    onSelectDate(formattedDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.calendarContainer, { backgroundColor: colors.background }]}>
          
          {/* Header điều hướng tháng */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(prev => prev - 1); 
              } else {
                setCurrentMonth(prev => prev - 1);
              }
            }}>
              <FontAwesomeIcon icon={faChevronLeft} size={20} color={colors.textTitle} />
            </TouchableOpacity>

            <Text style={[styles.calendarTitle, { color: colors.textTitle }]}>
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </Text>

            <TouchableOpacity onPress={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(prev => prev + 1); 
              } else {
                setCurrentMonth(prev => prev + 1);
              }
            }}>
              <FontAwesomeIcon icon={faChevronRight} size={20} color={colors.textTitle} />
            </TouchableOpacity>
          </View>

          {/* Hàng tiêu đề Thứ */}
          <View style={styles.daysRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <Text key={i} style={[styles.dayName, { color: colors.textBody }]}>{day}</Text>
            ))}
          </View>

          {/* Lưới các ngày */}
          <View style={styles.gridContainer}>
            {getDaysInMonth().map((day, index) => {
              const dateString = day ? `${currentMonth + 1}/${day}/${currentYear}` : "";
              const isSelected = day !== null && selectedDate === dateString;

              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.dayCell, 
                    isSelected ? { backgroundColor: theme.COLORS.primary } : undefined
                  ]}
                  onPress={() => day && handleDatePress(day)}
                  disabled={!day}
                >
                  {day !== null ? (
                    <Text style={[
                      styles.dayText, 
                      { color: colors.textTitle },
                      isSelected ? { color: colors.white, fontFamily: theme.FONTS.bold } : undefined
                    ]}>
                      {day}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: theme.COLORS.primary, fontFamily: theme.FONTS.bold }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  calendarContainer: { 
    width: '85%', 
    borderRadius: 24, 
    padding: 20, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  calendarTitle: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 18 
  },
  daysRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 10 
  },
  dayName: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 14, 
    width: 30, 
    textAlign: 'center' 
  }, 
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start' 
  },
  dayCell: { 
    width: '14.28%', 
    aspectRatio: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginVertical: 2, 
    borderRadius: 20 
  },
  dayText: { 
    fontFamily: theme.FONTS.medium, 
    fontSize: 14 
  },
  closeButton: { 
    marginTop: 20, 
    alignSelf: 'flex-end', 
    padding: 10 
  },
});

export default CalendarPicker;