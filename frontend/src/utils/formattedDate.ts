import moment from "moment";

export default function formattedDate(date: string) {
  return moment(date).format("YYYY-MM-DD A h:mm");
}
