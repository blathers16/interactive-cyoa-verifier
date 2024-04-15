import { ID } from './id';

export interface ProjectGroup {
  id: string;
  name: string;
  elements: ID[];
}
