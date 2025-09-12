import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const iconForType = (type) => {
  switch (type) {
    case 'water': return '💧';
    case 'seed': return '🌱';
    case 'fertiliser': return '🧪';
    case 'harvest': return '🌾';
    case 'trim': return '✂️';
    default: return '📌';
  }
};

const CalendarPage = () => {
  const calendarRef = useRef(null);
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0,10);
  const plusDays = (n) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
  const [events, setEvents] = useState([
    { id: '1', title: `${iconForType('seed')} Seed Plot B`, start: `${iso(plusDays(0))}T08:00:00` },
    { id: '2', title: `${iconForType('water')} Water Field A`, start: `${iso(plusDays(0))}T17:30:00` },
    { id: '3', title: `${iconForType('fertiliser')} Fertiliser Spraying`, start: `${iso(plusDays(1))}T07:00:00` },
    { id: '4', title: `${iconForType('trim')} Trim Orchard`, start: `${iso(plusDays(2))}T10:00:00` },
    { id: '5', title: `${iconForType('harvest')} Harvest Wheat`, start: `${iso(plusDays(3))}T06:30:00` },
  ]);

  const handleDateSelect = (selectInfo) => {
    const title = window.prompt('Event title (e.g., Water Field, Fertiliser, Harvest):');
    const time = window.prompt('Time (HH:MM, 24h). Leave blank for all-day:');
    if (title) {
      const calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();
      const newEvent = {
        id: String(Date.now()),
        title,
        start: time ? `${selectInfo.startStr}T${time}:00` : selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };
      setEvents((prev) => [...prev, newEvent]);
      scheduleReminder(newEvent);
    }
  };

  const scheduleReminder = (event) => {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      const startTime = new Date(event.start).getTime();
      const now = Date.now();
      const delay = Math.max(0, startTime - now);
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          // eslint-disable-next-line no-new
          new Notification('KrishiSeva Reminder', {
            body: event.title,
          });
        } else {
          alert(`Reminder: ${event.title}`);
        }
      }, Math.min(delay, 2147483647));
    } catch (e) {
      // Fallback
      console.warn('Reminder scheduling failed, using alert fallback.');
      setTimeout(() => alert(`Reminder: ${event.title}`), 1000);
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <div style={{ padding: 'var(--spacing-xxl) 0' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>Calendar</h1>

        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          padding: 'var(--spacing-lg)'
        }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            select={handleDateSelect}
            eventContent={renderEventContent}
          />
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
            <span>Legend:</span>
            <span>💧 Water</span>
            <span>🌱 Seed</span>
            <span>🧪 Fertiliser</span>
            <span>🌾 Harvest</span>
            <span>✂️ Trim</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;



