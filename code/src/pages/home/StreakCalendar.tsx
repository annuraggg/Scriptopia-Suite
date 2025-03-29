import { Calendar, DateValue } from "@heroui/react";
import { getLocalTimeZone } from "@internationalized/date";
import { parseISO, format } from "date-fns";

const StreakCalendar = ({ dates = [] }: { dates: string[] }) => {
  const dateSet = new Set(
    dates.map((date) => {
      const localDate = format(parseISO(date), "yyyy-MM-dd");

      return localDate;
    })
  );

  const isDateUnavailable = (date: DateValue) => {
    const localDateString = format(
      date.toDate(getLocalTimeZone()),
      "yyyy-MM-dd"
    );
    return !dateSet.has(localDateString);
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
