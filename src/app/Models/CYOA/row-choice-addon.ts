import { Requirement } from './requirement';

export interface RowChoiceAddon {
  id: string;
  title: string;
  text: string;
  template: string;
  image: string;
  requireds: Requirement[];
}
