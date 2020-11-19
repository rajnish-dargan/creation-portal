import { Component, Input, OnInit } from '@angular/core';
import { ICollectionTreeNodes, ICollectionTreeOptions, MimeTypeTofileType } from '@sunbird/shared';
import * as TreeModel from 'tree-model';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-collection-tree-new',
  templateUrl: './collection-tree.component.html',
  styleUrls: ['./collection-tree.component.scss']
})
export class CollectionTreeComponent implements OnInit {

  @Input() public nodes: ICollectionTreeNodes;
  @Input() public options: ICollectionTreeOptions;
  @Input() contentStatus: any;
  private rootNode: any;
  public rootChildrens: any;
  private iconColor = {
    '0': 'fancy-tree-black',
    '1': 'fancy-tree-blue',
    '2': 'fancy-tree-green'
  };

  constructor() { }

  ngOnInit() {
    this.initialize();
  }

  private initialize() {
    this.rootNode = this.createTreeModel();
    if (this.rootNode) {
      this.rootChildrens = this.rootNode.children;
      this.addNodeMeta();
    }
  }

  private createTreeModel() {
    if (!this.nodes) { return; }
    const model = new TreeModel();
    return model.parse(this.nodes.data);
  }

  private addNodeMeta() {
    if (!this.rootNode) { return; }
    this.rootNode.walk((node) => {
      node.fileType = MimeTypeTofileType[node.model.mimeType];
      node.id = node.model.identifier;
      if (node.children && node.children.length) {
        if (this.options.folderIcon) {
          node.icon = this.options.folderIcon;
        }
        node.folder = true;
      } else {
        if ( node.fileType === MimeTypeTofileType['application/vnd.ekstep.content-collection']) {
          node.folder = true;
        } else {
          const indexOf = _.findIndex(this.contentStatus, { });
          if (this.contentStatus) {
            const content: any = _.find(this.contentStatus, { 'contentId': node.model.identifier});
            const status = (content && content.status) ? content.status.toString() : 0;
            node.iconColor = this.iconColor[status];
          } else {
            node.iconColor = this.iconColor['0'];
          }
          node.folder = false;
        }
        node.icon = this.options.customFileIcon[node.fileType] || this.options.fileIcon;
        node.icon = `${node.icon} ${node.iconColor}`;
      }
      // if (node.folder && !(node.children.length)) {
      //   this.setCommingSoonMessage(node);
      //   node.title = node.model.name + '<span> (' + this.commingSoonMessage + ')</span>';
      //   node.extraClasses = 'disabled';
      // } else {
        // if (this.isOffline && node.fileType === 'youtube' && this.status === 'OFFLINE') {
        //   node.title = `${node.model.name} <div class='sb-label sb-label-table sb-label-warning-0'>
        //   ${this.resourceService.frmelmnts.lbl.onlineOnly}</div>` ||
        // tslint:disable-next-line:max-line-length
        //     `Untitled File <div class='sb-label sb-label-table sb-label-warning-0'>${this.resourceService.frmelmnts.lbl.onlineOnly}</div>`;
        //   node.extraClasses = 'disabled';
        // } else {
          node.title = node.model.name || 'Untitled File';
          node.extraClasses = '';
        // }
      // }
    });
  }

}
