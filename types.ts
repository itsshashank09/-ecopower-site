
export interface Booking {
  id?: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  date?: string;
}

export enum ServiceType {
  WIRING = 'Wiring & Rewiring',
  REPAIRS = 'Repairs & Maintenance',
  INSTALLATION = 'Installations'
}
