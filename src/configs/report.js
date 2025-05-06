export default {
  billingSummary: {
    billingPeriodStart: "2025-03-08",
    billingPeriodEnd: "2025-04-07",
    electricity_kwh: 253,
    electricity_cost: 90.86,
    gas_therms: 125,
    gas_cost: 359.51,
    rate_plan_name: "TOU-DR-Residential",
    climate_zone: "Coastal",
    has_solar: true,
    solar_system_size_kw: null,
    net_metering_type: "NEM",
    true_up_date: "2025-08-06",
    utility_provider: "San Diego Gas & Electric",
    highest_hourly_demand_kw: 5.7,
    highest_demand_time: "2025-03-14 10:00 AM",
    serviceAddress: {
      street: "7953 KATHRYN CROSBY CT",
      city: "San Diego",
      state: "CA",
      zipCode: "92127",
    },
  },
  keyObservations: [
    "Your electricity usage is significantly higher than last month, showing a 44.6% increase, indicating potential inefficiencies.",
    "The Time of Use rate plan leads to higher charges during the on-peak period (4 PM - 9 PM) which should be minimized.",
    "Gas usage has also increased compared to last month, and your average daily therm usage is on the rise.",
  ],
  electricCostDrivers: [
    "Your on-peak usage of electricity (4 PM - 9 PM) is particularly high, leading to increased costs. On-peak rates are usually much higher than off-peak rates.",
    "The highest demand recorded this month was 5.7 kW during the morning peak hours, indicating the times when your electricity usage spikes.",
    "Your generation credits have reduced your overall cost but are still not enough to offset your higher usage.",
    "The total electricity charges of $90.86 indicate the necessity to potentially reduce usage during peak hours to prevent bill escalation in future months.",
  ],
  gasCostDrivers: [
    "Your gas usage this billing period was 125 therms, showing an increase from previous months, and this may be contributing significantly to the current bill.",
    "The rate of gas charged has changed mid-cycle, resulting in varied costs that complicate budgeting.",
    "High therm usage, particularly during winter months, suggests potential inefficiencies in heating or gas appliances.",
  ],
  tips: [
    "Shift your peak electricity usage to off-peak hours by scheduling heavy appliances like dishwashers and laundry machines to run at night.",
    "Consider setting your thermostat to a lower temperature for heating to reduce gas usage.",
    "Identify and sealing leaks around windows and doors will keep heating more efficient.",
    "Utilize your solar energy effectively during the day to offset some of your electricity usage, especially during peak times.",
    "Avoid using high-energy appliances during the peak hours of 4 PM - 9 PM to minimize costs.",
  ],
  quickWins: [
    {
      strategy: "Avoid usage during 4–9 PM daily",
      estimated_savings: "$10–$30/mo",
    },
    {
      strategy: "Run all appliances during Off-Peak",
      estimated_savings: "$5–$15/mo",
    },
    {
      strategy: "Seal leaks around doors and windows",
      estimated_savings: "$5–$20/mo",
    },
    {
      strategy: "Lower thermostat settings for heating",
      estimated_savings: "$5–$15/mo",
    },
    {
      strategy: "Optimize solar usage during day time",
      estimated_savings: "$10–$50/mo",
    },
  ],
};
