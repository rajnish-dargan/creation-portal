import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ActionService, UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-my-content',
  templateUrl: './my-content.component.html',
  styleUrls: ['./my-content.component.scss']
})
export class MyContentComponent implements OnInit {

  constructor( public actionService: ActionService, public resourceService: ResourceService, 
    public router: Router, private userService: UserService, private httpClient: HttpClient) { }
  public contentDetails = [];
  public showLoader = true;
  public user: string;
  ngOnInit() {
    this.user = _.get(this.userService, '_userid');
    this.getContentDetails();
  }
  viewDetailsBtnClicked(board, medium, gradeLevel, subject) {
    this.router.navigate(['/contribute/contentlist', { board: board, medium: medium, gradeLevel: gradeLevel, subject: subject}], { skipLocationChange: true });
  }
  getContentDetails() {
    this.contentDetails = this.getDruidData();
    this.showLoader = false;
  }

  getDruidData() {
    var data = [
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 1",
              "subject": "Mathematics",
              "medium": "English",
              "publishedCount": 17,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 1",
              "subject": "Hindi",
              "medium": "Hindi",
              "publishedCount": 6,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 1",
              "subject": "Mathematics",
              "medium": "Hindi",
              "publishedCount": 10,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 10",
              "subject": "Hindi",
              "medium": "English",
              "publishedCount": 0,
              "board": null
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 10",
              "subject": "Hindi",
              "medium": "English",
              "publishedCount": 32,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 10",
              "subject": "Science",
              "medium": "English",
              "publishedCount": 4,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 10",
              "subject": "Geography",
              "medium": "Hindi",
              "publishedCount": 3,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 10",
              "subject": "Hindi",
              "medium": "Hindi",
              "publishedCount": 6,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 6",
              "subject": "English",
              "medium": "English",
              "publishedCount": 5,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 7",
              "subject": "English",
              "medium": "English",
              "publishedCount": 6,
              "board": "CBSE"
          }
      },
      {
          "version": "v1",
          "timestamp": "1901-01-01T00:00:00.000Z",
          "event": {
              "gradeLevel": "Class 7",
              "subject": "Mathematics",
              "medium": "English",
              "publishedCount": 4,
              "board": "CBSE"
          }
      }
  ];
  return data;
  }

  testDruid() {
     const url = 'https://11.2.1.20:8082/druid/v2?pretty';
     let httpheader = new HttpHeaders({
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*'
     })
     let requestBody = {
      "queryType": "timeseries",
      "dataSource": "content-model-snapshot",
      "aggregations": [
          {
              "type": "count",
              "name": "count"
          }
      ],
      "granularity": "all",
      "postAggregations": [],
      "intervals": "1901-01-01T00:00:00+00:00/2101-01-01T00:00:00+00:00",
      "filter": {
          "type": "and",
          "fields": [
              {
                  "type": "selector",
                  "dimension": "medium",
                  "value": "English"
              },
              {
                  "type": "selector",
                  "dimension": "board",
                  "value": "CBSE"
              },
              {
                  "type": "selector",
                  "dimension": "subject",
                  "value": "English"
              },
              {
                  "type": "selector",
                  "dimension": "gradeLevel",
                  "value": "Class 7"
              },
              {
                  "type": "selector",
                  "dimension": "createdBy",
                  "value": "19ba0e4e-9285-4335-8dd0-f674bf03fa4d"
              },
              {
                  "type": "not",
                  "field": {
                      "type": "selector",
                      "dimension": "mimeType",
                      "value": "application/vnd.ekstep.content-collection"
                  }
              },
              {
                  "type": "not",
                  "field": {
                      "type": "selector",
                      "dimension": "contentType",
                      "value": "Asset"
                  }
              }
          ]
      }
  }
  return this.httpClient.post(url, requestBody, {headers: httpheader});
  }
}
