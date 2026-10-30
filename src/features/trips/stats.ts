import { differenceInCalendarDays, parseISO } from 'date-fns';

import { getCountry } from '@/lib/countries';

import { Trip } from './types';

export function tripDays(trip: Pick<Trip, 'startDate' | 'endDate'>): number {
  if (!trip.startDate) return 0;
  if (!trip.endDate) return 1;
  return Math.max(
    1,
    differenceInCalendarDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1
  );
}

export function tripYear(trip: Trip): number {
  return parseISO(trip.startDate).getFullYear();
}

/** 최신 여행이 앞으로 */
export function sortTrips(trips: Trip[]): Trip[] {
  return [...trips].sort(
    (a, b) => b.startDate.localeCompare(a.startDate) || b.createdAt - a.createdAt
  );
}

export function groupByYear(trips: Trip[]): [number, Trip[]][] {
  const map = new Map<number, Trip[]>();
  sortTrips(trips).forEach((t) => {
    const y = tripYear(t);
    map.set(y, [...(map.get(y) ?? []), t]);
  });
  return [...map.entries()];
}

export function computeStats(trips: Trip[]) {
  const countries = new Map<string, number>();
  const cities = new Set<string>();
  const continents = new Set<string>();
  let days = 0;
  let places = 0;

  trips.forEach((t) => {
    countries.set(t.countryCode, (countries.get(t.countryCode) ?? 0) + 1);
    if (t.city) cities.add(`${t.countryCode}:${t.city.trim().toLowerCase()}`);
    const continent = getCountry(t.countryCode)?.continent;
    if (continent) continents.add(continent);
    days += tripDays(t);
    places += t.places.length;
  });

  const favorite = [...countries.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    trips: trips.length,
    countries: countries.size,
    countryCodes: [...countries.keys()],
    countryCounts: countries,
    cities: cities.size,
    continents: continents.size,
    days,
    places,
    favorite: favorite ? { code: favorite[0], count: favorite[1] } : null,
  };
}
