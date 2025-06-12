
export interface RepresentativeRow {
  name: string;
  email: string;
  phone: string;
  state: string;
  region: string;
  rowIndex: number;
  isValid: boolean;
  errors: string[];
}
