export interface TimeSlotSection {
  title: string;
  icon: string;
  slots: string[];
}

export const TIME_SLOT_SECTIONS: TimeSlotSection[] = [
  {
    title: 'Buổi Sáng',
    icon: '☀️',
    slots: ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  },
  {
    title: 'Buổi Chiều',
    icon: '🌤️',
    slots: ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
  },
  {
    title: 'Buổi Tối',
    icon: '🌙',
    slots: ['18:00', '18:30', '19:00', '19:30', '20:00'],
  },
];

export const ALL_TIME_SLOTS = TIME_SLOT_SECTIONS.flatMap((s) => s.slots);
