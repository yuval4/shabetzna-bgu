export const dateWithoutTime = (input: Date | string) => {
  const parsedDate = new Date(input);

  if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');

  return new Date(
    Date.UTC(
      parsedDate.getUTCFullYear(),
      parsedDate.getUTCMonth(),
      parsedDate.getUTCDate(),
    ),
  );
};
