import { IUserData, ILocationCoords } from '../Models';
import moment from 'moment';

const storePrefix = 'Klimate-data-';

const apiKey_label = storePrefix + 'apiKey';
const lat_label = storePrefix + 'lat';
const long_label = storePrefix + 'long';

export function getLocalUserData(): IUserData | null {
  try {
    var apiKey = localStorage.getItem(apiKey_label);
    var lat = localStorage.getItem(lat_label);
    var long = localStorage.getItem(long_label);
    if (apiKey && lat && long) {
      return {
        apiKey: apiKey.trim(),
        lat: Number(lat),
        long: Number(long)
      };
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

export function setLocalUserData(data: IUserData): void {
  localStorage.setItem(apiKey_label, data.apiKey);
  localStorage.setItem(lat_label, data.lat.toString());
  localStorage.setItem(long_label, data.long.toString());
}

export function clearLocalUserData(): void {
  localStorage.removeItem(apiKey_label);
  localStorage.removeItem(lat_label);
  localStorage.removeItem(long_label);
}

export function getLocation(): Promise<ILocationCoords> {
  return new Promise((resolve, reject) => {
    try {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat:
              Math.round((position.coords.latitude + Number.EPSILON) * 100000) /
              100000,
            long:
              Math.round(
                (position.coords.longitude + Number.EPSILON) * 100000
              ) / 100000
          });
        },
        error => {
          reject(error);
        }
      );
    } catch (e) {
      reject('Unable to fetch location: ' + e);
    }
  });
}

export function getDateFromTimestamp(
  timestamp: number,
  relativeFromNow: boolean = false,
  format: string = 'DD-MM-YYYY'
): string {
  if (relativeFromNow) {
    return moment(timestamp * 1000).fromNow();
  }
  return moment(timestamp * 1000).format(format);
}

export function getHoursFromTimestamp(timestamp: number): number {
  return moment.duration(moment(timestamp * 1000).format('HH:mm')).asHours();
}

export function getCurrentTimeInHrs(): number {
  return (
    Math.round(moment.duration(moment().format('HH:mm')).asHours() * 100) / 100
  );
}

export function isToday(timestamp: number): boolean {
  return moment(timestamp * 1000).isSame(moment.now(), 'day');
}

export function isAfter(timestamp: number): boolean {
  return moment(timestamp * 1000).isAfter(moment.now());
}
