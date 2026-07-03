export interface BoothRecord {
  voterName: string;
  epicNumber: string;
  partNumber: string;
  serialNumber: string;
  boothName: string;
  address: string;
  latitude: number;
  longitude: number;
  pollingHours: string;
  facilities: string[];
  assemblyConstituency: string;
  parliamentaryConstituency: string;
  isDemoData: true;
}

export function getMockBooth(epicNumber: string): BoothRecord {
  return {
    voterName: "Sample Voter",
    epicNumber: epicNumber,
    partNumber: "142",
    serialNumber: "567",
    boothName: "Govt Primary School, Room 2",
    address: "Sector 4, Main Road, Varanasi, UP 221005",
    latitude: 25.3176,
    longitude: 82.9739,
    pollingHours: "7:00 AM - 6:00 PM",
    facilities: ["Wheelchair Ramp", "Drinking Water", "Washroom"],
    assemblyConstituency: "Varanasi North",
    parliamentaryConstituency: "Varanasi",
    isDemoData: true
  };
}
