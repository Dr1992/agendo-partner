import { LocaleConfig } from "react-native-calendars";

const PT_LOCALE = {
  amDesignator: "",
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  pmDesignator: "",
};

const EN_LOCALE = {
  amDesignator: "AM",
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  pmDesignator: "PM",
};

if (!LocaleConfig.locales.pt) {
  LocaleConfig.locales.pt = PT_LOCALE;
}
if (!LocaleConfig.locales.en) {
  LocaleConfig.locales.en = EN_LOCALE;
}
LocaleConfig.defaultLocale = "pt";

/** Alinha o locale do `react-native-calendars` ao idioma da UI. */
export function applyCalendarLocale(locale: "pt" | "en"): void {
  LocaleConfig.defaultLocale = LocaleConfig.locales[locale] ? locale : "pt";
}
