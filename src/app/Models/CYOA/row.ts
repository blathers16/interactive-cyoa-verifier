import { Requirement } from './requirement';
import { RowChoice } from './row-choice';
import { RowStyling } from './row-styling';

export interface Row {
  id: string;
  title: string;
  titleText: string;
  objectWidth: string;
  image: string;
  template: string;
  isButtonRow: boolean;
  buttonType: boolean;
  buttonId: string;
  buttonText: string;
  buttonRandom: boolean;
  buttonRandomNumber: number;
  isResultRow: boolean;
  resultGroupId: string;
  isInfoRow: boolean;
  isPrivateStyling: boolean;
  defaultAspectWidth: number;
  defaultAspectHeight: number;
  allowedChoices: number;
  currentChoices: number;
  requireds: Requirement[];
  isEditModeOn: boolean;
  isRequirementOpen: boolean;
  objects: RowChoice[];
  styling: RowStyling;
}
