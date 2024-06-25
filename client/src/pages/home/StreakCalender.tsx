import { Calendar, DateValue } from "@nextui-org/react";
import { today, getLocalTimeZone, isWeekend } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

const StreakCalender = ({ dates }: { dates: string[] }) => {
  // ! FIX THIS CALENDER TO CUT ALL THE DATES WHICH ARE NOT IN DATES PROP
  const now = today(getLocalTimeZone());
  const dateArray = dates.map((date) => new Date(date));

  console.log(dateArray);

  const disabledRanges = [
    [now, now.add({ days: 5 })],
  ];

  const { locale } = useLocale();

  const isDateUnavailable = (date: DateValue) =>
    disabledRanges.some(
      (interval) =>
        date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
    );

  return (
    <Calendar
      aria-label="Date (Unavailable)"
      isDateUnavailable={isDateUnavailable}
      isReadOnly
    />
  );
};

export default StreakCalender;
