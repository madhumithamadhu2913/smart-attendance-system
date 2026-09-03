import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';

function TimetableView() {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    api.get('/timetable')
      .then((res) => setTimetable(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const groupedByDay = days.map((day) => ({
    day,
    classes: timetable
      .filter((t) => t.day_of_week === day)
      .sort((a, b) => a.period_number - b.period_number),
  }));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiCalendar /> College Timetable
        </h1>

        <div className="grid gap-6">
          {groupedByDay.map(({ day, classes }) => (
            <div key={day} className="bg-white rounded-2xl p-5 shadow">
              <h3 className="font-bold text-pista-700 mb-3">{day}</h3>
              {classes.length === 0 ? (
                <p className="text-gray-400 text-sm">No classes scheduled.</p>
              ) : (
                <div className="grid gap-2">
                  {classes.map((c) => (
                    <div
                      key={c.timetable_id}
                      className="flex justify-between items-center border rounded-xl p-3 hover:bg-pista-50"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          Period {c.period_number}: {c.subject_name} ({c.subject_code})
                        </p>
                        <p className="text-sm text-gray-500">
                          {c.faculty_name} — Batch {c.batch_year} {c.section}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiClock /> {c.start_time?.slice(0, 5)} - {c.end_time?.slice(0, 5)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin /> {c.room_number}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimetableView;