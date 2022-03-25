import { mount } from "@vue/test-utils";
import Datepicker from "@/components/DatePicker/index.vue";
import Day from "@/components/Day.vue";

describe("Datepicker Calendar", () => {
  const wrapper = mount(Datepicker);

  it("should correctly re-render the calendar", () => {
    expect(wrapper.vm.show).toBe(true);
    wrapper.vm.reRender();
    expect(wrapper.vm.isOpen).toBe(false);

    setTimeout(() => {
      expect(wrapper.vm.isOpen).toBe(true);
    }, 200);
  });
});

describe("Datepicker Component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      components: { Day },
      propsData: {
        minNights: 3,
        disabledDates: ["2020-05-28", "2020-05-10", "2020-05-01", "2020-05-22"],
      },
    });
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

  describe("Periods", () => {
    beforeEach(() => {
      wrapper = mount(Datepicker, {
        propsData: {
          countOfDesktopMonth: 24,
          alwaysVisible: true,
          minNights: 3,
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
        },
      });
    });

    it("case 1 (3 nights min then 7 nights min) > I must be able to select from 3/01 to 10/01", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2023-01-03"]');

      await checkInDay.trigger("click");

      // à tester quand le tooltip sera réglé
      console.log(wrapper.vm.checkInPeriod);

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

      expect(beforeDay.classes()).toEqual([
        "datepicker__month-day",
        "datepicker__month-day--valid",
        "datepicker__month-day--disabled",
        "datepicker__month-day--not-allowed",
        "minimumDurationUnvalidDay",
        "datepicker__month-day--disabled",
        "datepicker__month-day--not-allowed",
        "nightly",
      ]);
      expect(possibleCheckout.classes()).toEqual([
        "datepicker__month-day",
        "datepicker__month-day--valid",
        "nightly",
      ]);
    });

    it("case 2 (same min duration: 7 nights min then Sunday to Sunday) > I can select from 13/01 to 22/01", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2023-01-13"]');

      await checkInDay.trigger("click");

      expect(wrapper.vm.dynamicNightCounts).toBe(7);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(8);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).toBe(6);
    });

    it("case 2 (min duration: 10 nights min > only Sunday to Sunday) > I must be able to select from 24/02 to 5/03 Sunday to Sunday takes priority over the 10 night minimum", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2023-02-24"]');

      await checkInDay.trigger("click");

      expect(wrapper.vm.dynamicNightCounts).toBe(7);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).toBe(6);
    });

    it("case 3 (duration min night < duration Sunday to Sunday): Sunday to Sunday then 3 nights min > I can select from 25/12 to 02/01", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2022-12-25"]');

      await checkInDay.trigger("click");

      expect(wrapper.vm.dynamicNightCounts).toBe(7);
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(3);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(6);
    });

    it("case 3 (duration min night > duration Sunday to Sunday): Sunday to Sunday then 10 nights min > I can select from 22/01 to 30/01", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2023-01-22"]');

      await checkInDay.trigger("click");

      expect(wrapper.vm.dynamicNightCounts).toBe(10);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(10);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(9);
      // The last day disable must be a Tuesday to be able to output on Wednesday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[8]).getDay()).toBe(2);
    });

    it("case 4 (same min duration): saturday to saturday (min 2 weeks each period) > I can select from sept 3 to sept 17", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2022-09-03"]');

      await checkInDay.trigger("click");

      expect(wrapper.vm.dynamicNightCounts).toBe(14);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(2);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(13);
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[12]).getDay()).toBe(5);
    });

    it("case 4 (2 different durations): Saturday to Saturday (min 2 weeks and min 3 weeks) > I can select from 15/10 to 05/11", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2022-10-15"]');

      await checkInDay.trigger("click");

      expect(wrapper.vm.dynamicNightCounts).toBe(21);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(3);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(20);
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[19]).getDay()).toBe(5);
    });

    it("case 5 (Saturday to Saturday then Sunday to Sunday) > I must not be able to select from 08/04 to 16/04 but I can select from 08/04 to 30/04", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2023-04-08"]');

      await checkInDay.trigger("click");

      expect(wrapper.vm.dynamicNightCounts).toBe(21);
      expect(wrapper.vm.dynamicNightCounts).toBe(21);

      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(21);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[6]).getDay()).toBe(6);
    });

    it.only("case 6 (Sunday to Sunday then Saturday to Saturday) > I must not be able to select from 02/26 to 03/18 (the 3-week Saturday to Saturday constraint is not respected)", async () => {
      const checkInDay = wrapper.get('[data-testid="day-2023-02-26"]');

      await checkInDay.trigger("click");

      // Le test fail à réparer, il devrait être à 21 et non à 7
      expect(wrapper.vm.dynamicNightCounts).toBe(21);
      expect(wrapper.vm.dynamicNightCounts).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(3);
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(26);
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[25]).getDay()).toBe(5);
    });
  });
});

// Si je clique sur le 08/04/2023 => je devrait avoir le 16/04 23/04 de surligner et là c'est pas le cas
// Vérifier que checkInPeriod correspond à ce que le calendrier affiche et donc au tooltip
// 26/02/2023 => 7 jours ? il devrait être à 21 jours comme ce qu'affiche le calendrier
