import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, PaginationService } from '@sunbird/shared';
import { ActionService, ProgramsService, UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination} from './../../../../modules/cbse-program/interfaces';
import { McqCreationComponent } from '../../../cbse-program/components/mcq-creation/mcq-creation.component';
import { ContentComponentsService } from '../../services/content-components/content-components.service';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import { forkJoin, Observable } from 'rxjs';
@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
})
export class ContentListComponent implements OnInit {

  constructor(public actionService: ActionService, public resourceService: ResourceService,
    public route:ActivatedRoute, public router: Router, public paginationService: PaginationService,
    public programsService: ProgramsService, public userService: UserService, 
    private _contentComponentService: ContentComponentsService, private collectionHierarchyService: CollectionHierarchyService) { }

  public contentList = [];
  public contentCount: any;
  board:string;
  medium:string;
  gradeLevel:string;
  subject:string;
  pager: IPagination;
  pageNumber = 1;
  pageLimit = 10;
  public contentDetail;
  public direction = 'asc';
  public showLoader = true;
  public paginatedContent: any = [];
  public contributorContents: any = [];
  public user: string;
  public showPreview = false;
  public name: string;
  public sortColumn: string;
  ngOnInit() {
    this.user = _.get(this.userService, '_userid');
    this.route.paramMap.subscribe( paramMap => {
      this.board = paramMap.get('board');
      this.medium = paramMap.get('medium');
      this.gradeLevel = paramMap.get('gradeLevel');
      this.subject = paramMap.get('subject');
  })
    this.getContentList();
  }
  getContentList() {
    const option = {
      url: 'composite/v3/search',
      data: {
        request: {
          filters: {
            objectType: 'Content',
              status: [
                  'Live'
              ],
              contentType: {
                  '!=': 'Asset'
              },
              mimeType: {
                  '!=': 'application/vnd.ekstep.content-collection'
              },
              createdBy: this.user,
              board: [
                  this.board,
              ],
              subject: [
                  this.subject
              ],
              medium: [
                  this.medium
              ],
              gradeLevel: [
                  this.gradeLevel
              ]
          },
          not_exists: [
            'sampleContent'
          ]
        }
      }
    };
    this.actionService.post(option).subscribe(
      (response) => {
        const contents = _.get(response, 'result.content', []);
        this.contentCount = _.get(response, 'result.count');
        const identifiers = _.map(contents, (identifier) => {
          return _.get(identifier, 'identifier');
        });
        var statusMapping = [];
        forkJoin(_.map(identifiers, (identifier: string) => {
          return this.getContentStatus(identifier);
        })).subscribe((forkResponse) => {
          _.forEach(forkResponse, response => {
            const resultCount = _.get(response, 'result.count');
            if(resultCount === 0) {
              statusMapping.push('not published')
            }
            else {
              statusMapping.push('published')
            }
          });
          for (var i = 0; i < statusMapping.length; i++) {
            contents[i]['contentStatus'] = statusMapping[i];
          }
          this.contentList = contents;
          this.sortColumn = 'name';
          this.direction = 'desc';
          this.sortContentList(this.sortColumn);
          this.showLoader = false;
        },
        (error) => {
          console.log(error);
        });
      },
      (err) => console.log(err)
    );
  }

  sortContentList(column) {
    var allcontentList = this.contentList;
    this.contentList = this.programsService.sortCollection(allcontentList, column, this.direction);
    if (this.direction === 'asc') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
    allcontentList = _.chunk(this.contentList, this.pageLimit);
    this.paginatedContent = allcontentList;
    this.contributorContents = allcontentList[this.pageNumber-1];
    this.pager = this.paginationService.getPager(this.contentCount, this.pageNumber, this.pageLimit);
 }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.contributorContents = this.paginatedContent[this.pageNumber -1];
    this.pager = this.paginationService.getPager(this.contentCount, this.pageNumber, this.pageLimit);
  }

  public handlerContentPreview(contentData) {
    this._contentComponentService.setContentData(contentData);
    this.showPreview = true;
    return this.router.navigate(['/contribute/contentpreview'], { skipLocationChange: true });

  }

  getContentStatus (acceptedContents) {
    return this.collectionHierarchyService.getOriginForApprovedContents(acceptedContents);
    
  }

  public navigateBack() {
    return this.router.navigate(['/contribute/mycontent'], { skipLocationChange: true });
  }
}
