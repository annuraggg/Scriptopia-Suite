import { Calendar, DateValue } from "@nextui-org/react";
import { getLocalTimeZone } from "@internationalized/date";
const StreakCalendar = ({ dates = [] }: { dates: string[] }) => {
  const dateSet = new Set(dates.map((date) => new Date(date).toISOString().split('T')[0])); // Create a set of date strings

  const isDateUnavailable = (date: DateValue) => {
    // Check if the date is not in the dateSet
    return !dateSet.has(date.toDate(getLocalTimeZone()).toISOString().split('T')[0]);
  };

  return (
    <Calendar
      aria-label="Streak Calendar"
      isDateUnavailable={isDateUnavailable}
      isReadOnly
      className="mt-0"
    />
  );
};

export default StreakCalendar;
