import { expect } from "chai";
import { mount } from "@vue/test-utils";

import Datepicker from "@/components/DatePicker/index.vue";

describe("Datepicker Calendar", () => {
  const wrapper = mount(Datepicker);

  it("should correctly re-render the calendar", () => {
    expect(wrapper.vm.show).to.equal(true);
    wrapper.vm.reRender();
    expect(wrapper.vm.isOpen).to.equal(false);

    setTimeout(() => {
      expect(wrapper.vm.isOpen).to.equal(true);
    }, 200);
  });
});

describe("Datepicker Component", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Datepicker, {
      attachToDocument: true,
      propsData: {
        minNights: 3,
        disabledDates: ["2020-05-28", "2020-05-10", "2020-05-01", "2020-05-22"],
      },
    });
  });

  it("should toggle the calendar visibility on input click", () => {
    expect(wrapper.vm.isOpen).to.equal(false);

    const datepickerInput = wrapper.find('[data-qa="datepickerInput"]');

    datepickerInput.trigger("click");

    expect(wrapper.vm.isOpen).to.equal(true);
  });

  it("should correctly render the next and previous months", () => {
    const { activeMonthIndex } = wrapper.vm;

    wrapper.vm.renderNextMonth();
    expect(wrapper.vm.activeMonthIndex).to.equal(activeMonthIndex + 1);

    wrapper.vm.renderPreviousMonth();
    expect(wrapper.vm.activeMonthIndex).to.equal(activeMonthIndex);
  });

  describe("Periods", () => {
    beforeEach(() => {
      wrapper = mount(Datepicker, {
        attachToDocument: true,
        propsData: {
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

    it("case 1 (3 nights min then 7 nights min) > I must be able to select from 3/01 to 10/01", () => {
      wrapper.vm.checkIn = new Date("2023-01-03");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(7);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(7);
      expect(wrapper.vm.nextPeriodDisableDates.length).equal(6);
      // The last day disable must be a Monday to be able to output on Tuesday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).equal(1);
    });

    it("case 2 (same min duration: 7 nights min then Sunday to Sunday) > I can select from 13/01 to 22/01", () => {
      wrapper.vm.checkIn = new Date("2023-01-13");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(7);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(1);
      expect(wrapper.vm.nextPeriodDisableDates.length).equal(8);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).equal(6);
    });

    it("case 2 (min duration: 10 nights min > only Sunday to Sunday) > I must be able to select from 24/02 to 5/03 Sunday to Sunday takes priority over the 10 night minimum", () => {
      wrapper.vm.checkIn = new Date("2023-02-24");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(7);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(1);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).equal(6);
    });

    it("case 3 (duration min night < duration Sunday to Sunday): Sunday to Sunday then 3 nights min > I can select from 25/12 to 02/01", () => {
      wrapper.vm.checkIn = new Date("2022-12-25");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(3);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(3);
      expect(wrapper.vm.nextPeriodDisableDates.length).equal(2);
      // The last day disable must be a Tuesday to be able to output on Wednesday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[1]).getDay()).equal(2);
    });

    it("case 3 (duration min night > duration Sunday to Sunday): Sunday to Sunday then 10 nights min > I can select from 22/01 to 30/01", () => {
      wrapper.vm.checkIn = new Date("2023-01-22");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(10);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(10);
      expect(wrapper.vm.nextPeriodDisableDates.length).equal(9);
      // The last day disable must be a Tuesday to be able to output on Wednesday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[8]).getDay()).equal(2);
    });

    it("case 4 (same min duration): saturday to saturday (min 2 weeks each period) > I can select from sept 3 to sept 17", () => {
      wrapper.vm.checkIn = new Date("2022-09-03");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(14);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(2);
      expect(wrapper.vm.nextPeriodDisableDates.length).equal(13);
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[12]).getDay()).equal(5);
    });

    it("case 4 (2 different durations): Saturday to Saturday (min 2 weeks and min 3 weeks) > I can select from 15/10 to 05/11", () => {
      wrapper.vm.checkIn = new Date("2022-10-15");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(21);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(3);
      expect(wrapper.vm.nextPeriodDisableDates.length).equal(20);
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[19]).getDay()).equal(5);
    });

    it("case 5 (Saturday to Saturday then Sunday to Sunday) > I must not be able to select from 08/04 to 16/04 but I can select from 08/04 to 23/04", () => {
      wrapper.vm.checkIn = new Date("2023-04-08");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(7);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(1);
      expect(wrapper.vm.nextPeriodDisableDates.length).equal(7);
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[6]).getDay()).equal(6);
    });

    it("case 6 (Sunday to Sunday then Saturday to Saturday) > I must not be able to select from 02/26 to 03/18 (the 3-week Saturday to Saturday constraint is not respected)", () => {
      wrapper.vm.checkIn = new Date("2023-02-26");
      wrapper.vm.setMinimumDuration(wrapper.vm.checkIn);

      expect(wrapper.vm.dynamicNightCounts).equal(21);
      expect(wrapper.vm.dynamicNightCounts).equal(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
      expect(wrapper.vm.nextPeriod.minimumDuration).equal(3);
      expect(wrapper.vm.nextPeriodDisableDates.length).equal(26);
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[25]).getDay()).equal(5);
    });
  });
});
