import { Component } from '@angular/core';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbAlert,
} from '@ng-bootstrap/ng-bootstrap';
import { uniqWith, isEqual } from 'lodash-es';

import { Project } from '../Models/CYOA/project';
import { RowChoice } from '../Models/CYOA/row-choice';
import { Row } from '../Models/CYOA/row';
import { Requirement } from '../Models/CYOA/requirement';
import { ID } from '../Models/CYOA/id';
import { PointType } from '../Models/CYOA/point-type';
import { Variable } from '../Models/CYOA/variable';
import { Score } from '../Models/CYOA/score';

@Component({
  selector: 'app-verifier',
  standalone: true,
  imports: [
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionBody,
    NgbAccordionDirective,
    NgbAlert,
  ],
  templateUrl: './verifier.component.html',
  styleUrl: './verifier.component.scss',
})
export class VerifierComponent {
  // ui flags
  clearPicker: boolean = true;
  showActivatedAlert = true;
  loading: boolean = false;

  // error flags
  hasDuplicateChoices = false;
  hasScoreWithoutPointType: boolean = false;
  hasRequirementMissingChoice: boolean = false;
  hasRequirementNotSpecified: boolean = false;
  hasRequirementPointTypeNotSpecified: boolean = false;

  // arrays
  activated: string[] = [];
  allChoices: RowChoice[] = [];
  pointTypes: PointType[] = [];
  duplicateChoices: RowChoice[] = [];
  rowsWithBadRequirements: Row[] = [];
  choicesWithBadRequirements: RowChoice[] = [];
  choicesWithBadScores: RowChoice[] = [];


  // the cyoa
  cyoa: Project | null = null;

  toggleClearPicker() {
    this.clearPicker = !this.clearPicker;
  }

  closeActivatedAlert() {
    this.showActivatedAlert = false;
  }

  getChoice(id: string): RowChoice | null {
    const rowsWithMatchingObject: Row[] = this.cyoa!.rows.filter((r: Row) => {
      return r.objects.some((c: RowChoice) => c.id === id);
    });
    if (rowsWithMatchingObject.length === 1) {
      return rowsWithMatchingObject[0].objects.filter(
        (c: RowChoice) => c.id === id
      )[0];
    } else if (rowsWithMatchingObject.length > 1) {
      return null;
    } else {
      return null;
    }
  }

  getRowForChoice(id: string): Row[] {
    return this.cyoa!.rows.filter((r: Row) =>
      r.objects.some((c: RowChoice) => c.id === id)
    );
  }

  isValidSelectable(id: string): boolean {
    if (this.allChoices.some((c: RowChoice) => c.id === id)) {
      return true;
    } else {
      return this.cyoa!.variables.some((v: Variable) => v.id === id);
    }
  }

  // validate that choices in requirements are still in cyoa
  validateRequirementChoiceExists(r: Requirement): boolean {
    let valid = true;
    if (!this.isValidSelectable(r.reqId) && r.reqId !== '') valid = false;
    if (!this.isValidSelectable(r.reqId1) && r.reqId1 !== '') valid = false;
    if (!this.isValidSelectable(r.reqId2) && r.reqId2 !== '') valid = false;
    if (!this.isValidSelectable(r.reqId3) && r.reqId3 !== '') valid = false;
    if (
      !r.requireds.every((rq: Requirement) =>
        this.validateRequirementChoiceExists(rq)
      )
    )
      valid = false;
    if (
      !r.orRequired.every(
        (id: ID) => id.req === '' || this.isValidSelectable(id.req)
      )
    )
      valid = false;

    return valid;
  }

  // validate that choices have been selected for choice type
  // requirements
  validateRequirementSpecified(r: Requirement): boolean {
    let valid = false;
    if (r.type === 'id') {
      if (r.reqId !== '') valid = true;
      if (r.reqId1 !== '') valid = true;
      if (r.reqId2 !== '') valid = true;
      if (r.reqId3 !== '') valid = true;
      if (!r.orRequired.every((id: ID) => id.req === '')) valid = false;
    } else if (r.type === 'or') {
      if (r.orRequired.some((id: ID) => id.req !== '')) valid = true;
      if (r.orRequired.length === 0) valid = false;
      if (r.reqId !== '') valid = false;
      if (r.reqId1 !== '') valid = false;
      if (r.reqId2 !== '') valid = false;
      if (r.reqId3 !== '') valid = false;
    } else if (r.type === 'points') {
      valid = true;
    } else if (r.type === 'pointCompare') {
      valid = true;
    }
    if (
      !r.requireds.every((rq: Requirement) =>
        this.validateRequirementSpecified(rq)
      )
    )
      valid = false;

    return valid;
  }

  // validate that point types have been selected for point
  // requirements
  validateRequirementPointsSpecified(r: Requirement): boolean {
    let valid = false;
    if (r.type === 'id') {
      valid = true;
    } else if (r.type === 'or') {
      valid = true;
    } else if (r.type === 'points') {
      if (this.pointTypes.some((p: PointType) => p.id === r.reqId))
        valid = true;
    } else if (r.type === 'pointCompare') {
      valid = true;
      if (!this.pointTypes.some((p: PointType) => p.id === r.reqId))
        valid = false;
      if (!this.pointTypes.some((p: PointType) => p.id === r.reqId1))
        valid = false;
    }

    if (
      !r.requireds.every((rq: Requirement) =>
        this.validateRequirementPointsSpecified(rq)
      )
    )
      valid = false;

    return valid;
  }

  async process(e: Event | null): Promise<void> {
    if (!e) return;
    const target = e.target as HTMLInputElement;
    let infiles = target.files;
    // incase you canceled the file select, you won't lose your
    // previous result
    if (!infiles) return;
    
    this.loading = true;

    //reset ui flags
    this.showActivatedAlert = true;

    //reset error flags
    this.hasDuplicateChoices = false;
    this.hasScoreWithoutPointType = false;
    this.hasRequirementMissingChoice = false;
    this.hasRequirementNotSpecified = false;
    this.hasRequirementPointTypeNotSpecified = false;

    // reset arrays
    this.activated = [];
    this.allChoices = [];
    this.pointTypes = [];
    this.duplicateChoices = [];
    this.rowsWithBadRequirements = [];
    this.choicesWithBadRequirements = [];

    const infile: File = infiles[0];

    const fileString: string = await infile.text();

    this.cyoa = JSON.parse(fileString);

    console.log(this.cyoa);

    this.cyoa!.rows.forEach((r: Row) => {
      r.objects.forEach((c: RowChoice) => this.allChoices.push(c));
    });

    console.log(this.allChoices);

    this.cyoa?.pointTypes.forEach((p: PointType) => {
      this.pointTypes.push(p);
    });

    const ids = this.allChoices.map((c: RowChoice) => c.id);

    this.hasDuplicateChoices = (new Set(ids)).size !== ids.length;

    if (this.hasDuplicateChoices) {
      let valuesSoFar = Object.create(null);
      this.allChoices.forEach((c: RowChoice) => {
        if (c.id in valuesSoFar) {
          this.allChoices
            .filter((c2: RowChoice) => (c2.id = c.id))
            .forEach((c3: RowChoice) => this.duplicateChoices.push(c3));
        }
        valuesSoFar[c.id] = true;
      });
    }

    this.duplicateChoices = uniqWith(this.duplicateChoices, isEqual);

    this.cyoa?.rows.forEach((r: Row) => {
      r.requireds.forEach((req: Requirement) => {
        const valid = this.validateRequirementChoiceExists(req);
        if (!valid) {
          this.rowsWithBadRequirements.push(r);
          this.hasRequirementMissingChoice = true;
        }
        const specified = this.validateRequirementSpecified(req);
        if (!specified) {
          this.rowsWithBadRequirements.push(r);
          this.hasRequirementNotSpecified = true;
        }
        const pointsSpecified = this.validateRequirementPointsSpecified(req);
        if (!pointsSpecified) {
          this.rowsWithBadRequirements.push(r);
          this.hasRequirementPointTypeNotSpecified = true;
        }
      });
      r.objects.forEach((c: RowChoice) => {
        c.requireds.forEach((req: Requirement) => {
          const valid = this.validateRequirementChoiceExists(req);
          if (!valid) {
            this.choicesWithBadRequirements.push(c);
            this.hasRequirementMissingChoice = true;
          }
          const specified = this.validateRequirementSpecified(req);
          if (!specified) {
            this.choicesWithBadRequirements.push(c);
            this.hasRequirementNotSpecified = true;
          }
          const pointsSpecified = this.validateRequirementPointsSpecified(req);
          if (!pointsSpecified) {
            this.choicesWithBadRequirements.push(c);
            this.hasRequirementPointTypeNotSpecified = true;
          }
        });
        c.scores.forEach((s: Score) => {
          s.requireds.forEach((req: Requirement) => {
            const valid = this.validateRequirementChoiceExists(req);
            if (!valid) {
              this.choicesWithBadRequirements.push(c);
              this.hasRequirementMissingChoice = true;
            }
            const specified = this.validateRequirementSpecified(req);
            if (!specified) {
              this.choicesWithBadRequirements.push(c);
              this.hasRequirementNotSpecified = true;
            }
            const pointsSpecified = this.validateRequirementPointsSpecified(req);
            if (!pointsSpecified) {
              this.choicesWithBadRequirements.push(c);
              this.hasRequirementPointTypeNotSpecified = true;
            }
          });
          if(!this.pointTypes.some((p: PointType) => s.id === p.id)) {
            this.hasScoreWithoutPointType = true;
            this.choicesWithBadScores.push(c);
          }
        })
      });
    });

    this.activated = this.cyoa!.activated;

    this.loading = false;
  }
}
