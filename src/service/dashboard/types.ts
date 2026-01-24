import { Travel } from '../travelsList/types';

export interface DashboardData {
  stats: {
    totalCountries: number;
    totalCities: number;
    tripsThisYear: number;
    mostVisited: { name: string; count: number };
    totalDays: number;
  };
  mapData: {
    visitedCodes: string[];
  };
  travels: Travel[];
}
