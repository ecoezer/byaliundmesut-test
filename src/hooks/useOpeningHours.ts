export const useOpeningHours = () => {
  const now = new Date();
  const day = now.getDay();
  const currentTime = now.getHours() + now.getMinutes() / 60;

  const CLOSED_DAY = 2; // Tuesday
  const OPENING_HOUR = 12;
  const CLOSING_HOUR = 21.5; // 21:30

  const isClosedToday = day === CLOSED_DAY;
  const isOpenToday = !isClosedToday;

  const isOpen = isOpenToday && currentTime >= OPENING_HOUR && currentTime < CLOSING_HOUR;

  const getDayName = (date: Date) =>
    new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(date);

  const nextOpeningTime = (() => {
    if (!isOpenToday) return 'Mittwoch ab 12:00 Uhr wieder geöffnet';
    if (currentTime < OPENING_HOUR) return 'heute ab 12:00 Uhr wieder geöffnet';
    if (currentTime >= CLOSING_HOUR) {
      let nextDay = new Date(now);
      do {
        nextDay.setDate(nextDay.getDate() + 1);
      } while (nextDay.getDay() === CLOSED_DAY);
      return `${getDayName(nextDay)} ab 12:00 Uhr wieder geöffnet`;
    }
    return '';
  })();

  const currentHours = isClosedToday ? 'Ruhetag' : '12:00–21:30';

  return {
    isOpen,
    openingTime: isOpenToday ? OPENING_HOUR : 0,
    closingTime: isOpenToday ? CLOSING_HOUR : 0,
    nextOpeningTime,
    currentHours,
    isTuesday: isClosedToday
  };
};
