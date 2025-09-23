export const useOpeningHours = () => {
  const now = new Date();
  const day = now.getDay();

  const CLOSED_DAY = 2; // Tuesday
  const OPENING_HOUR = 12;
  const CLOSING_HOUR = 21.5;

  const hours = now.getHours();
  const minutes = now.getMinutes();

  if (hours > 23 || minutes > 59) throw new Error("Invalid time");

  const currentTime = hours + minutes / 60;
  const isClosed = day === CLOSED_DAY;
  const isOpen = !isClosed && currentTime >= OPENING_HOUR && currentTime < CLOSING_HOUR;

  const formatDay = new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format;

  const nextOpeningTime = (() => {
    if (isClosed) return 'Mittwoch ab 12:00 Uhr wieder geöffnet';
    if (currentTime < OPENING_HOUR) return 'heute ab 12:00 Uhr wieder geöffnet';
    if (currentTime >= CLOSING_HOUR) {
      let nextDay = new Date(now);
      do nextDay.setDate(nextDay.getDate() + 1);
      while (nextDay.getDay() === CLOSED_DAY);
      return `${formatDay(nextDay)} ab 12:00 Uhr wieder geöffnet`;
    }
    return '';
  })();

  return {
    isOpen,
    openingTime: isClosed ? 0 : OPENING_HOUR,
    closingTime: isClosed ? 0 : CLOSING_HOUR,
    nextOpeningTime,
    currentHours: isClosed ? 'Ruhetag' : '12:00–21:30',
    isTuesday: isClosed
  };
};
