import { ID } from './id';

export interface Requirement {
  required: boolean;
  requireds: Requirement[];
  orRequired: ID[];
  id: string;
  type: string;
  reqId: string;
  reqId1: string;
  reqId2: string;
  reqId3: string;
  reqPoints: 0;
  showRequired: false;
  operator: string;
  afterText: string;
  beforeText: string;
}
