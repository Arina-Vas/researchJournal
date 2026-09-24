import { MedicationItem } from '../../../entities/medications/lib/type';

export const DASHBOARD_COLORS = ['#3874ff', '#0080c7', '#adc5ff'];

// --- Helper Utilities ---
const parseEndDate = (endDate?: string | Date): Date | null => {
  if (!endDate) return null;
  const date = new Date(endDate);
  return isNaN(date.getTime()) ? null : date;
};

const attachDashboardColor = <T extends object>(item: T, index: number) => ({
  ...item,
  fill: DASHBOARD_COLORS[index % DASHBOARD_COLORS.length],
});

const getShortMonthName = (year: number, monthIndex: number): string => {
  return new Date(year, monthIndex, 15).toLocaleDateString('en-US', { month: 'short' });
};

const createYearMonthsMap = <T>(initialValueFactory: () => T): Map<number, T> => {
  const map = new Map<number, T>();
  for (let month = 0; month < 12; month++) {
    map.set(month, initialValueFactory());
  }
  return map;
};

// --- Selectors ---

export const selectTotalTestsByMonth = (items: MedicationItem[]) => {
  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;

  const monthsMap = createYearMonthsMap(() => ({ current: 0, previous: 0 }));

  items.forEach(item => {
    const itemDate = parseEndDate(item.endDate);
    if (!itemDate) return;

    const itemYear = itemDate.getFullYear();
    const itemMonth = itemDate.getMonth();

    const monthData = monthsMap.get(itemMonth);
    if (!monthData) return;

    if (itemYear === currentYear) monthData.current += 1;
    if (itemYear === prevYear) monthData.previous += 1;
  });

  return Array.from(monthsMap.entries()).map(([monthIndex, counts]) => ({
    monthName: getShortMonthName(currentYear, monthIndex),
    ...counts,
  }));
};

export const selectTestingProcessByPhase = (items: MedicationItem[]) => {
  const currentYear = new Date().getFullYear();
  const map = new Map<string, { name: MedicationItem['phase']; value: number }>();

  items.forEach(item => {
    const itemDate = parseEndDate(item.endDate);
    if (!itemDate || itemDate.getFullYear() !== currentYear) return;

    const current = map.get(item.phase) || { name: item.phase, value: 0 };
    map.set(item.phase, { name: item.phase, value: current.value + 1 });
  });

  return Array.from(map.values()).map(attachDashboardColor);
};

export const selectTestedPeopleLastYear = (items: MedicationItem[]) => {
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365);

  let tested = 0;
  let nonTested = 0;

  items.forEach(item => {
    const itemDate = parseEndDate(item.endDate);
    if (!itemDate) return;

    if (itemDate >= oneYearAgo && itemDate <= now) {
      tested += item.participants?.tested || 0;
      nonTested += item.participants?.nonTested || 0;
    }
  });

  const result = [
    { name: 'tested' as const, value: tested },
    { name: 'nonTested' as const, value: nonTested },
  ];

  return result.map(attachDashboardColor);
};

export const selectApprovalRateByMonth = (items: MedicationItem[]) => {
  if (!items.length) return [];

  const currentYear = new Date().getFullYear();
  const prevYear = currentYear - 1;

  const monthsMap = createYearMonthsMap(() => ({
    currentSum: 0,
    currentCount: 0,
    prevSum: 0,
    prevCount: 0,
  }));

  items.forEach(item => {
    const itemDate = parseEndDate(item.endDate);
    if (!itemDate) return;

    const itemYear = itemDate.getFullYear();
    const itemMonth = itemDate.getMonth();
    const monthData = monthsMap.get(itemMonth);
    if (!monthData) return;

    const rate = item.approvalRate || 0;

    if (itemYear === currentYear) {
      monthData.currentSum += rate;
      monthData.currentCount += 1;
    } else if (itemYear === prevYear) {
      monthData.prevSum += rate;
      monthData.prevCount += 1;
    }
  });

  return Array.from(monthsMap.entries()).map(([monthIndex, counts]) => ({
    date: getShortMonthName(currentYear, monthIndex),
    current: counts.currentCount > 0 ? Math.round(counts.currentSum / counts.currentCount) : 0,
    previous: counts.prevCount > 0 ? Math.round(counts.prevSum / counts.prevCount) : 0,
  }));
};

export const selectStatusByDate = (items: MedicationItem[]) => {
  const map = new Map<string, { completed: number; awaiting: number; originalDate: Date }>();
  const currentYear = new Date().getFullYear();

  items.forEach(item => {
    const dateObj = parseEndDate(item.endDate);
    if (!dateObj || dateObj.getFullYear() !== currentYear) return;

    const formattedDate = dateObj.toLocaleDateString('en-US');
    const current = map.get(formattedDate) || { completed: 0, awaiting: 0, originalDate: dateObj };

    if (item.status === 'completed') {
      current.completed += 1;
    } else {
      current.awaiting += 1;
    }

    map.set(formattedDate, current);
  });

  return Array.from(map.values())
    .map(counts => {
      const total = counts.completed + counts.awaiting;
      const completedPercent = Math.round((counts.completed / total) * 100);

      return {
        date: counts.originalDate.toLocaleDateString('en-US'),
        completed: completedPercent === 0 ? 0.01 : completedPercent,
        rawCompleted: completedPercent,
        awaiting: 100 - completedPercent,
        originalDate: counts.originalDate,
      };
    })
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime());
};
