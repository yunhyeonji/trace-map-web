export interface Travel {
  id: number;
  title: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  titleImageUrl: string;
  tags?: string[];
  description?: string;
  companions?: string[];
}
