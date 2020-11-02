import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService, ActionService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ContentComponentsService } from '../../services/content-components/content-components.service';
import { ResourceService } from '@sunbird/shared';
import { catchError, map, first, filter } from 'rxjs/operators';
import { throwError, Observable, Subscription } from 'rxjs';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import { HelperService } from '../../../cbse-program/services/helper.service';
import { CbseProgramService } from '../../../cbse-program/services/cbse-program/cbse-program.service';
@Component({
  selector: 'app-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.scss']
})
export class ContentPreviewComponent implements OnInit {
  public playerConfig;
  public showLoader = true;

  public contentData;
  public showLicense = false;
  public ShowCopyright = false;
  public showAuthor = false;
  public showAttributions
  // public contentMeta;
  public contentOriginData;
  public originPreviewUrl;
  // public contentMetaData;
  public contentpublished =  false;
  constructor(public route:ActivatedRoute, public router: Router,
     public playerService: PlayerService, public contentComponentService: ContentComponentsService,
     private resourceService: ResourceService, public actionService: ActionService,
     private collectionHierarchyService: CollectionHierarchyService, private helperService: HelperService,
     private cbseService: CbseProgramService) { }

  ngOnInit() {
    this.contentComponentService.contentdata.subscribe (
      contentdata => {
        this.contentData = contentdata;
        console.log('contentdata', this.contentData);
        this.showLicense = _.has(this.contentData, 'license');
        this.ShowCopyright = _.has(this.contentData, 'copyright');
        this.showAuthor = _.has(this.contentData, 'author');
        this.showAttributions = _.has(this.contentData, 'attributions');

        this.getallData(contentdata.identifier);
        var previewData = {contentData: contentdata, contentId: contentdata.identifier};
        this.previewContent(previewData);
      }
    )
  }

  async getallData(contentIdentifier) {
    await this. getOriginForApprovedContents(contentIdentifier);
  }

  public previewContent(previewData) {
    this.playerConfig = this.playerService.getConfig(previewData);
    this.showLoader = false;
  }

  public getOriginForApprovedContents (acceptedContents) {
    this.collectionHierarchyService.getOriginForApprovedContents(acceptedContents).subscribe(
      (response) => {
        console.log()
        if (_.get(response, 'result.count') && _.get(response, 'result.count') > 0) {
          this.contentOriginData = _.get(response, 'result.content');
          console.log('this.contentOriginData', this.contentOriginData);
          if( this.contentOriginData[0].status == 'Live' ) {
            this.contentpublished = true;
            this.originPreviewUrl =  this.helperService.getContentOriginUrl(this.contentOriginData[0].identifier);
          }
        }
      },
      (error) => {
        console.log('Getting origin data failed');
    });
  }

  handleBack() {
    this.router.navigate(['/contribute/contentlist', { board: this.contentData.board, medium: this.contentData.medium, gradeLevel: this.contentData.gradeLevel, subject: this.contentData.subject}], { skipLocationChange: true });
  }

}
