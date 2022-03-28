import { mount } from "@vue/test-utils";
import Datepicker from "@/components/DatePicker/index.vue";
import Day from "@/components/Day.vue";

let wrapper = null;
const periodDates = [
  {
    startAt: "2022-08-06",
    endAt: "2022-09-10",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-09-10",
    endAt: "2022-10-01",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-10-08",
    endAt: "2022-10-22",
    periodType: "weekly_by_saturday",
    minimumDuration: 2
  },
  {
    startAt: "2022-10-22",
    endAt: "2022-11-26",
    periodType: "weekly_by_saturday",
    minimumDuration: 3
  },
  {
    startAt: "2022-12-18",
    endAt: "2023-01-01",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-01-01",
    endAt: "2023-01-05",
    periodType: "nightly",
    minimumDuration: 3
  },
  {
    startAt: "2023-01-05",
    endAt: "2023-01-15",
    periodType: "nightly",
    minimumDuration: 7
  },
  {
    startAt: "2023-01-15",
    endAt: "2023-01-29",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-01-29",
    endAt: "2023-02-26",
    periodType: "nightly",
    minimumDuration: 10
  },
  {
    startAt: "2023-02-26",
    endAt: "2023-03-05",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-03-11",
    endAt: "2023-04-15",
    periodType: "weekly_by_saturday",
    minimumDuration: 3
  },
  {
    startAt: "2023-04-16",
    endAt: "2023-05-21",
    periodType: "weekly_by_sunday",
    minimumDuration: 1
  },
  {
    startAt: "2023-05-21",
    endAt: "2023-05-25",
    periodType: "nightly",
    minimumDuration: 2
  },
  {
    startAt: "2023-05-25",
    endAt: "2023-05-28",
    periodType: "nightly",
    minimumDuration: 3
  },
  {
    startAt: "2023-05-28",
    endAt: "2023-06-04",
    periodType: "nightly",
    minimumDuration: 7
  }
];

const mountComponent = (
  startDate = new Date("01-01-2022"),
  alwaysVisible = true
) => {
  return mount(Datepicker, {
    components: { Day },
    propsData: {
      alwaysVisible,
      countOfDesktopMonth: 2,
      minNights: 3,
      periodDates,
      startDate
    }
  });
};

afterEach(() => {
  wrapper.destroy();
});

describe("Datepicker Calendar", () => {
  it("should correctly re-render the calendar", async () => {
    wrapper = await mountComponent(new Date("01-01-2023"), false);

    expect(wrapper.vm.show).toBe(true);
    wrapper.vm.reRender();
    expect(wrapper.vm.isOpen).toBe(false);

    setTimeout(() => {
      expect(wrapper.vm.isOpen).toBe(true);
    }, 200);
  });
});

describe("Datepicker Component", () => {
  describe("Dom Element", () => {
    beforeEach(async () => {
      wrapper = await mountComponent(new Date("01-01-2023"), false);
    });

    it("should toggle the calendar visibility on input click", () => {
      expect(wrapper.vm.isOpen).toBe(false);

      const datepickerInput = wrapper.find('[data-qa="datepickerInput"]');

      datepickerInput.trigger("click");

      expect(wrapper.vm.isOpen).toBe(true);
    });

    it("should correctly render the next and previous months", () => {
      const { activeMonthIndex } = wrapper.vm;

      wrapper.vm.renderNextMonth();
      expect(wrapper.vm.activeMonthIndex).toBe(activeMonthIndex + 1);

      wrapper.vm.renderPreviousMonth();
      expect(wrapper.vm.activeMonthIndex).toBe(activeMonthIndex);
    });
  });

  // describe case 1 (3 nights min then 7 nights min) > I must be able to select from 3/01 to 10/01
  // => it should be the result in html is correct
  // => it should be the result in class

  describe("Periods", () => {
    it("case 1 (3 nights min then 7 nights min) > I must be able to select from 3/01 to 10/01", async () => {
      wrapper = await mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 4,
          alwaysVisible: true,
          startDate: new Date("2023-01-01"),
          minNights: 3,
          periodDates
        }
      });

      const checkInDay = wrapper.get('[data-testid="day-2023-01-03"]');

      await checkInDay.trigger("click");

      // CheckInPeriod
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      expect(wrapper.vm.customTooltip).toBe("7 Nights minimum.");

      expect(wrapper.vm.dynamicNightCounts).toBe(7);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(7);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      // The last day disable must be a Monday to be able to output on Tuesday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(1);

      const beforeDay = wrapper.get('[data-testid="day-2023-01-08"]');
      const possibleCheckout = wrapper.get('[data-testid="day-2023-01-10"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("datepicker__month-day--disabled");
      expect(beforeDay.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDay.classes()).toContain("nightly");

      // Possible CheckOut
      expect(possibleCheckout.classes()).toContain("datepicker__month-day");
      expect(possibleCheckout.classes()).toContain(
        "datepicker__month-day--valid"
      );
      expect(possibleCheckout.classes()).toContain("nightly");
    });

    it("case 2 (same min duration: 7 nights min then Sunday to Sunday) > I can select from 13/01 to 22/01", async () => {
      wrapper = await mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 4,
          alwaysVisible: true,
          startDate: new Date("2023-01-01"),
          minNights: 3,
          periodDates
        }
      });

      const checkInDay = wrapper.get('[data-testid="day-2023-01-13"]');

      await checkInDay.trigger("click");

      // CheckInPeriod
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      expect(wrapper.vm.customTooltip).toBe("1 week minimum.");

      expect(wrapper.vm.dynamicNightCounts).toBe(7);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(8);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).toBe(6);

      const beforeDay = wrapper.get('[data-testid="day-2023-01-21"]');
      const possibleCheckout = wrapper.get('[data-testid="day-2023-01-22"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("datepicker__month-day--disabled");
      expect(beforeDay.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDay.classes()).toContain("nightly");

      // Possible CheckOut
      expect(possibleCheckout.classes()).toContain("datepicker__month-day");
      expect(possibleCheckout.classes()).toContain(
        "datepicker__month-day--valid"
      );
    });

    it("case 2 (min duration: 10 nights min > only Sunday to Sunday) > I must be able to select from 24/02 to 5/03 Sunday to Sunday takes priority over the 10 night minimum", async () => {
      wrapper = await mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 4,
          alwaysVisible: true,
          startDate: new Date("2023-02-01"),
          minNights: 3,
          periodDates
        }
      });

      const checkInDay = wrapper.get('[data-testid="day-2023-02-24"]');

      await checkInDay.trigger("click");

      // CheckInPeriod
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      expect(wrapper.vm.customTooltip).toBe("1 week minimum.");

      expect(wrapper.vm.dynamicNightCounts).toBe(7);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).toBe(6);

      const beforeDay = wrapper.get('[data-testid="day-2023-03-04"]');
      const possibleCheckout = wrapper.get('[data-testid="day-2023-03-05"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("datepicker__month-day--disabled");
      expect(beforeDay.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDay.classes()).toContain("nightly");

      // Possible CheckOut
      expect(possibleCheckout.classes()).toContain("datepicker__month-day");
      expect(possibleCheckout.classes()).toContain(
        "datepicker__month-day--valid"
      );
    });

    it("case 3 (duration min night < duration Sunday to Sunday): Sunday to Sunday then 3 nights min > I can select from 25/12 to 02/01", async () => {
      wrapper = await mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 4,
          alwaysVisible: true,
          startDate: new Date("2022-12-01"),
          minNights: 3,
          periodDates
        }
      });

      const checkInDay = wrapper.get('[data-testid="day-2022-12-25"]');

      await checkInDay.trigger("click");

      // CheckInPeriod
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      expect(wrapper.vm.customTooltip).toBe("1 week minimum.");

      expect(wrapper.vm.dynamicNightCounts).toBe(7);
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(3);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(6);

      const beforeDay = wrapper.get('[data-testid="day-2022-12-31"]');
      const possibleCheckoutOne = wrapper.get('[data-testid="day-2023-01-01"]');
      const possibleCheckoutTwo = wrapper.get('[data-testid="day-2023-01-02"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("datepicker__month-day--disabled");
      expect(beforeDay.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDay.classes()).toContain("nightly");

      // Possible CheckOut
      expect(possibleCheckoutOne.classes()).toContain("datepicker__month-day");
      expect(possibleCheckoutOne.classes()).toContain(
        "datepicker__month-day--valid"
      );
      expect(possibleCheckoutTwo.classes()).toContain("datepicker__month-day");
      expect(possibleCheckoutTwo.classes()).toContain(
        "datepicker__month-day--valid"
      );
    });

    it("case 3 (duration min night > duration Sunday to Sunday): Sunday to Sunday then 10 nights min > I can select from 22/01 to 30/01", async () => {
      wrapper = await mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 4,
          alwaysVisible: true,
          startDate: new Date("2023-01-01"),
          minNights: 3,
          periodDates
        }
      });

      const checkInDay = wrapper.get('[data-testid="day-2023-01-22"]');

      await checkInDay.trigger("click");

      // CheckInPeriod
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
      expect(wrapper.vm.customTooltip).toBe("1 week minimum.");

      expect(wrapper.vm.dynamicNightCounts).toBe(7);
      expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(10);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(6);

      const beforeDay = wrapper.get('[data-testid="day-2023-01-28"]');
      const possibleCheckoutOne = wrapper.get('[data-testid="day-2023-01-29"]');
      const possibleCheckoutTwo = wrapper.get('[data-testid="day-2023-01-30"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("datepicker__month-day--disabled");
      expect(beforeDay.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDay.classes()).toContain("nightly");

      // Possible CheckOut
      expect(possibleCheckoutOne.classes()).toContain("datepicker__month-day");
      expect(possibleCheckoutOne.classes()).toContain(
        "datepicker__month-day--valid"
      );
      expect(possibleCheckoutTwo.classes()).toContain("datepicker__month-day");
      expect(possibleCheckoutTwo.classes()).toContain(
        "datepicker__month-day--valid"
      );
    });

    it("case 4 (same min duration): saturday to saturday (min 2 weeks each period) > I can select from sept 3 to sept 17", async () => {
      wrapper = await mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 4,
          alwaysVisible: true,
          startDate: new Date("2022-09-01"),
          minNights: 3,
          periodDates
        }
      });

      const checkInDay = wrapper.get('[data-testid="day-2022-09-03"]');

      await checkInDay.trigger("click");

      // CheckInPeriod
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(14);
      expect(wrapper.vm.customTooltip).toBe("2 weeks minimum.");

      expect(wrapper.vm.dynamicNightCounts).toBe(14);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(2);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(13);
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[12]).getDay()).toBe(5);

      const beforeDay = wrapper.get('[data-testid="day-2022-09-16"]');
      const possibleCheckout = wrapper.get('[data-testid="day-2022-09-17"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("datepicker__month-day--disabled");
      expect(beforeDay.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDay.classes()).toContain("nightly");

      // Possible CheckOut
      expect(possibleCheckout.classes()).toContain("datepicker__month-day");
      expect(possibleCheckout.classes()).toContain(
        "datepicker__month-day--valid"
      );
    });

    it("case 4 (2 different durations): Saturday to Saturday (min 2 weeks and min 3 weeks) > I can select from 15/10 to 05/11", async () => {
      wrapper = await mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 4,
          alwaysVisible: true,
          startDate: new Date("2022-10-01"),
          minNights: 3,
          periodDates
        }
      });

      const checkInDay = wrapper.get('[data-testid="day-2022-10-15"]');

      await checkInDay.trigger("click");

      // CheckInPeriod
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(21);
      expect(wrapper.vm.customTooltip).toBe("3 weeks minimum.");

      expect(wrapper.vm.dynamicNightCounts).toBe(21);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(3);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(20);
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[19]).getDay()).toBe(5);

      const beforeDay = wrapper.get('[data-testid="day-2022-11-04"]');
      const possibleCheckout = wrapper.get('[data-testid="day-2022-11-05"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("datepicker__month-day--disabled");
      expect(beforeDay.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDay.classes()).toContain("nightly");

      // Possible CheckOut
      expect(possibleCheckout.classes()).toContain("datepicker__month-day");
      expect(possibleCheckout.classes()).toContain(
        "datepicker__month-day--valid"
      );
    });

    it("case 5 (Saturday to Saturday then Sunday to Sunday) > I must not be able to select from 08/04 to 16/04 but I can select from 08/04 to 30/04", async () => {
      wrapper = await mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 4,
          alwaysVisible: true,
          startDate: new Date("2023-03-01"),
          minNights: 3,
          periodDates
        }
      });

      const checkInDay = wrapper.get('[data-testid="day-2023-04-08"]');

      await checkInDay.trigger("click");

      // CheckInPeriod
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(21);
      expect(wrapper.vm.customTooltip).toBe("3 weeks minimum.");

      expect(wrapper.vm.dynamicNightCounts).toBe(21);

      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(21);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[6]).getDay()).toBe(6);

      const beforeDayOne = wrapper.get('[data-testid="day-2023-04-16"]');
      const beforeDayTwo = wrapper.get('[data-testid="day-2023-04-23"]');
      const beforeDayThree = wrapper.get('[data-testid="day-2023-04-29"]');
      const possibleCheckout = wrapper.get('[data-testid="day-2023-04-30"]');

      // Can't select the 2023-04-16
      expect(beforeDayOne.classes()).toContain(
        "datepicker__month-day--disabled"
      );
      expect(beforeDayOne.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDayOne.classes()).toContain("nightly");

      // Can't select the 2023-04-23
      expect(beforeDayTwo.classes()).toContain(
        "datepicker__month-day--disabled"
      );
      expect(beforeDayTwo.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDayTwo.classes()).toContain("nightly");

      // Can't select the 2023-04-29
      expect(beforeDayThree.classes()).toContain(
        "datepicker__month-day--disabled"
      );
      expect(beforeDayThree.classes()).toContain(
        "datepicker__month-day--not-allowed"
      );
      expect(beforeDayThree.classes()).toContain("nightly");

      // Possible CheckOut on 2023-04-30
      expect(possibleCheckout.classes()).toContain("datepicker__month-day");
      expect(possibleCheckout.classes()).toContain(
        "datepicker__month-day--valid"
      );
    });
  });
});

// Vérifier que checkInPeriod correspond à ce que le calendrier affiche et donc au tooltip
// 26/02/2023 => 7 jours ? il devrait être à 21 jours comme ce qu'affiche le calendrier
