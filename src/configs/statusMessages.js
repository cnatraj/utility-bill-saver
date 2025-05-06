import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  BoltIcon,
  FireIcon,
  DocumentTextIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  CalculatorIcon,
  ClockIcon,
  CheckBadgeIcon,
} from "@heroicons/vue/24/outline";

export const statusMessages = [
  {
    message: "Analyzing your bill…",
    icon: MagnifyingGlassIcon,
  },
  {
    message: "Calculating usage patterns…",
    icon: ChartBarIcon,
  },
  {
    message: "Spotting high-cost hours…",
    icon: BoltIcon,
  },
  {
    message: "Identifying energy hogs…",
    icon: FireIcon,
  },
  {
    message: "Reviewing your rate plan…",
    icon: DocumentTextIcon,
  },
  {
    message: "Scanning appliance efficiency…",
    icon: Cog8ToothIcon,
  },
  {
    message: "Formulating quick-win tips…",
    icon: LightBulbIcon,
  },
  {
    message: "Crunching savings estimates…",
    icon: CalculatorIcon,
  },
  {
    message: "Assessing peak vs off-peak usage…",
    icon: ClockIcon,
  },
  {
    message: "Finalizing your energy report…",
    icon: CheckBadgeIcon,
  },
];

export default statusMessages;
