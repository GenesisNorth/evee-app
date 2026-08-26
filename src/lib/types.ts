export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  range_km: number;
  battery_kwh: number;
  acceleration_0_100: number;
  charge_time_hours: number;
  top_speed_kph: number;
  seats: number;
  drivetrain: string;
  body_type: string;
  image_url: string | null;
  tagline: string | null;
  description: string | null;
  is_new: boolean;
}

export interface Profile {
  id: string;
  full_name: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  avatar_url: string | null;
  onboarded: boolean;
}

export interface GarageVehicle {
  id: string;
  nickname: string | null;
  odometer_km: number;
  battery_pct: number;
  status: string;
  vehicle: Pick<Vehicle, "id" | "make" | "model" | "image_url"> | null;
}

export interface FinancingApplication {
  id: string;
  term_months: number;
  estimated_monthly: number;
  status: string;
  vehicle: Pick<Vehicle, "make" | "model"> | null;
}

export interface InsuranceQuote {
  id: string;
  provider: string;
  plan_tier: string;
  annual_premium: number;
  status: string;
  vehicle: Pick<Vehicle, "make" | "model"> | null;
}
