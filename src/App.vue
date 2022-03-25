<template>
  <div id="app" style="margin: 0 auto;">
    <DatePicker
      ref="DatePicker"
      clickOutsideElementId="clickOutsideElement"
      :firstDayOfWeek="1"
      :disabledDates="[]"
      :showYear="true"
      :format="dateFormat"
      :lastDateAvailable="lastDateAvailable"
      :minNights="minNights"
      :i18n="frFR"
      :disableCheckoutOnCheckin="true"
      :periodDates="periodDates"
      @renderNextMonth="renderNextMonth"
    />
  </div>
</template>

<script>
import DatePicker from "./components/DatePicker/index.vue";

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      dynamicDisabledDates: ["2021-04-30", "2021-05-01", "2021-05-02"],
      ptPT: {
        night: "Noite",
        nights: "Noites",
        "day-names": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        "check-in": "Partida",
        "check-out": "Chegada",
        "month-names": [
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
        tooltip: {
          halfDayCheckIn: "Reservas possíveis",
          halfDayCheckOut: "Reservas possíveis",
          saturdayToSaturday: "Sábado a Sábado<br/> apenas",
          sundayToSunday: "Domingo a domingo<br/> apenas",
          minimumRequiredPeriod: "%{minNightInPeriod} %{night} mínimo.",
        },
        week: "semana",
        weeks: "semanas",
      },
      frFR: {
        "check-in": "Arrivée",
        "check-out": "Départ",
        "day-names": ["lu", "ma", "me", "je", "ve", "sa", "di"],
        "month-names": [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ],
        night: "nuit",
        nights: "nuits",
        tooltip: {
          halfDayCheckIn: "Réservation possible",
          halfDayCheckOut: "Réservation possible",
          saturdayToSaturday: "Du samedi au samedi<br/> uniquement",
          sundayToSunday: "Du dimanche au dimanche<br/> uniquement",
          minimumRequiredPeriod: "%{minNightInPeriod} %{night} minimum",
        },
        week: "semaine",
        weeks: "semaines",
      },
      periodDates: [
        {
          startAt: "2022-08-06",
          endAt: "2022-09-10",
          periodType: "weekly_by_saturday",
          minimumDuration: 2,
        },
        {
          startAt: "2022-09-10",
          endAt: "2022-10-01",
          periodType: "weekly_by_saturday",
          minimumDuration: 2,
        },
        {
          startAt: "2022-10-08",
          endAt: "2022-10-22",
          periodType: "weekly_by_saturday",
          minimumDuration: 2,
        },
        {
          startAt: "2022-10-22",
          endAt: "2022-11-26",
          periodType: "weekly_by_saturday",
          minimumDuration: 3,
        },
        {
          startAt: "2022-12-18",
          endAt: "2023-01-01",
          periodType: "weekly_by_sunday",
          minimumDuration: 1,
        },
        {
          startAt: "2023-01-01",
          endAt: "2023-01-05",
          periodType: "nightly",
          minimumDuration: 3,
        },
        {
          startAt: "2023-01-05",
          endAt: "2023-01-15",
          periodType: "nightly",
          minimumDuration: 7,
        },
        {
          startAt: "2023-01-15",
          endAt: "2023-01-29",
          periodType: "weekly_by_sunday",
          minimumDuration: 1,
        },
        {
          startAt: "2023-01-29",
          endAt: "2023-02-26",
          periodType: "nightly",
          minimumDuration: 10,
        },
        {
          startAt: "2023-02-26",
          endAt: "2023-03-05",
          periodType: "weekly_by_sunday",
          minimumDuration: 1,
        },
        {
          startAt: "2023-03-11",
          endAt: "2023-04-15",
          periodType: "weekly_by_saturday",
          minimumDuration: 3,
        },
        {
          startAt: "2023-04-16",
          endAt: "2023-05-21",
          periodType: "weekly_by_sunday",
          minimumDuration: 1,
        },
        {
          startAt: "2023-05-21",
          endAt: "2023-05-25",
          periodType: "nightly",
          minimumDuration: 2,
        },
        {
          startAt: "2023-05-25",
          endAt: "2023-05-28",
          periodType: "nightly",
          minimumDuration: 3,
        },
        {
          startAt: "2023-05-28",
          endAt: "2023-06-04",
          periodType: "nightly",
          minimumDuration: 7,
        },
      ],
      bookings: [
        {
          id: "1726359",
          checkInDate: "2021-08-22",
          checkOutDate: "2021-08-29",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
        {
          id: "1726360",
          checkInDate: "2021-08-15",
          checkOutDate: "2021-08-22",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
        {
          id: "1726358",
          checkInDate: "2021-08-01",
          checkOutDate: "2021-08-15",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
        {
          id: "1726357",
          checkInDate: "2021-09-01",
          checkOutDate: "2021-09-23",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
        {
          id: "1726356",
          checkInDate: "2021-06-01",
          checkOutDate: "2021-06-18",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
        {
          id: "181412",
          checkInDate: "2019-09-15",
          checkOutDate: "2019-10-15",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
        {
          id: "181491",
          checkInDate: "2019-07-01",
          checkOutDate: "2019-08-31",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
        {
          id: "178234",
          checkInDate: "2018-08-04",
          checkOutDate: "2018-08-25",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
        {
          id: "178235",
          checkInDate: "2018-07-01",
          checkOutDate: "2018-07-31",
          style: {
            backgroundColor: "#9DC1C9",
          },
        },
      ],
      newCheckInDate: null,
      newCheckOutDate: null,
      minNights: 3,
    };
  },
  computed: {
    dateFormat() {
      return "DD/MM/YYYY";
    },
    lastDateAvailable() {
      return this.addYears(new Date(), 2);
    },
  },
  methods: {
    renderNextMonth() {
      this.dynamicDisabledDates.push(
        "2021-05-11",
        "2021-05-12",
        "2021-05-13",
        "2021-05-14",
        "2021-05-15",
        "2021-05-16",
        "2021-05-17",
        "2021-05-18"
      );
    },
    toggleDatePickerOutside() {
      this.$refs.DatePicker.showDatepicker();
    },
    bookingClicked(event, date, currentBooking) {
      console.log("bookingClicked", event, date, currentBooking);
    },
    periodSelected(event, checkIn, checkOut) {
      console.log("periodSelected", event, checkIn, checkOut);
    },
    handleCheckIncheckOutHalfDay(checkIncheckOutHalfDay) {
      console.log("handleCheckIncheckOutHalfDay", checkIncheckOutHalfDay);
    },
    addYears(dt, n) {
      return new Date(dt.setFullYear(dt.getFullYear() + n));
    },
    validateDateBetweenTwoDates(fromDate, toDate, givenDate) {
      const getvalidDate = (d) => {
        return new Date(d);
      };

      return (
        getvalidDate(givenDate) <= getvalidDate(toDate) &&
        getvalidDate(givenDate) >= getvalidDate(fromDate)
      );
    },
    dayClicked(date, formatDate, nextDisabledDate) {
      console.log(date, formatDate, nextDisabledDate);
    },
    checkInChanged(newDate) {
      this.newCheckInDate = newDate;
    },
    checkOutChanged(newDate) {
      this.newCheckOutDate = newDate;
    },
  },
};
</script>

<style>
body,
html {
  font-family: "Source Sans Pro", sans-serif;
}

.box {
  width: 100%;
}
.datepicker__fullview .datepicker {
  z-index: 1;
}
</style>
