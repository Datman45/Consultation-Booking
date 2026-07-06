export function formatDate(value: Date | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  const days = String(date.getDate()).padStart(2, "0");
  const months = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return days + "." + months + "." + year + " | " + hours + ":" + minutes;
}
