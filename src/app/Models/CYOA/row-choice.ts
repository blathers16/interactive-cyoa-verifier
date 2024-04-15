import { ChoiceGroup } from './choice-group';
import { Requirement } from './requirement';
import { RowChoiceAddon } from './row-choice-addon';
import { Score } from './score';

export interface RowChoice {
  id: string;
  title: string;
  text: string;
  image: string;
  template: number;
  objectWidth: string;
  isActive: boolean;
  isVisible: boolean;
  multipleUseVariable: number;
  defaultAspectWidth: number;
  defaultAspectHeight: number;
  requireds: Requirement[];
  addons: RowChoiceAddon[];
  scores: Score[];
  groups: ChoiceGroup[];
}
