import { Requirement } from './requirement';

export interface Score {
  id: string;
  value: number;
  type: string;
  requireds: Requirement[];
  beforeText: string;
  afterText: string;
  showScore: boolean;
}
