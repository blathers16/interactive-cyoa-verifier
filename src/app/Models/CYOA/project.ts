import { PointType } from './point-type';
import { ProjectGroup } from './project-group';
import { ProjectStyling } from './project-styling';
import { Row } from './row';
import { Word } from './word';

export interface Project {
  isEditModeOnAll: boolean;
  isStyleOpen: boolean;
  isPointsOpen: boolean;
  isChoicesOpen: boolean;
  isDesignOpen: boolean;
  isViewerVersion: boolean;
  backpack: Row[];
  words: Word[];
  groups: ProjectGroup;
  chapters: [];
  activated: string[];
  rows: Row[];
  pointTypes: PointType[];
  variables: [];
  defaultRowTitle: string;
  defaultRowText: string;
  defaultChoiceTitle: string;
  defaultChoiceText: string;
  defaultBeforePoint: string;
  defaultAfterPoint: string;
  defaultBeforeReq: string;
  defaultAfterReq: string;
  defaultAddonTitle: string;
  defaultAddonText: string;
  styling: ProjectStyling;
}
