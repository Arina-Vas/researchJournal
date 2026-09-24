import { MedicationItem } from '../../../entities/medications/lib/type';

export interface TotalTestsDataItem {
  current: number;
  previous: number;
  monthName: string;
}

export interface TestingProcessDataItem {
  name: MedicationItem['phase'];
  value: number;
  fill: string;
}

export interface TestedPeopleDataItem {
  name: 'tested' | 'nonTested';
  value: number;
  fill: string;
}

export interface ApprovalRateDataItem {
  date: string;
  current: number;
  previous: number;
}

export interface StatusDataItem {
  date: string;
  completed: number;
  rawCompleted: number;
  awaiting: number;
  originalDate: Date;
}

export interface DashboardData<T> {
  data: T[];
  isLoading: boolean;
}
