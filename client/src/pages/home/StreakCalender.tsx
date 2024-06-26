import { Calendar, DateValue } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

const StreakCalendar = ({ dates = [] }: { dates: string[] }) => {
  const now = today(getLocalTimeZone());
  const dateSet = new Set(dates.map((date) => new Date(date).toISOString().split('T')[0])); // Create a set of date strings

  const { locale } = useLocale();

  const isDateUnavailable = (date: DateValue) => {
    // Check if the date is not in the dateSet
    return !dateSet.has(date.toDate(getLocalTimeZone()).toISOString().split('T')[0]);
  };

  return (
    <Calendar
      aria-label="Streak Calendar"
      isDateUnavailable={isDateUnavailable}
      isReadOnly
      className="hidden md:block"
    />
  );
};

export default StreakCalendar;
