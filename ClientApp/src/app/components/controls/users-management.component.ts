

import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { UserEdit } from '../../models/user-edit.model';
import { UserInfoComponent } from './user-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit, AfterViewInit {
  columns!: column[];
  rows: User[] = [];
  rowsCache: User[] = [];
  editedUser!: UserEdit | null;
  sourceUser!: UserEdit | null;
  editingUserName!: { name: string } | null;
  loadingIndicator!: boolean;

  allRoles: Role[] = [];


  @ViewChild('indexTemplate', { static: true })
  indexTemplate!: TemplateRef<any> ;

  @ViewChild('userNameTemplate', { static: true })
  userNameTemplate!: TemplateRef<any>;

  @ViewChild('rolesTemplate', { static: true })
  rolesTemplate!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<any>;

  @ViewChild('editorModal', { static: true })
  editorModal!: ModalDirective;

  @ViewChild('userEditor', { static: true })
  userEditor!: UserInfoComponent;

  constructor(private alertService: AlertService, private accountService: AccountService,private snackBar:MatSnackBar) {
  }


  ngOnInit() {

    //const gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      new column( "#",40,this.indexTemplate,true,false,true,true,"index"),
      new column( "Title",40,null,true,false,true,true,"jobTitle"),
      new column( "UserName",40,this.userNameTemplate,true,false,true,true,"userName"),
      new column( "FullName",40,null,true,false,true,true,"fullName"),
      new column( "Email",40,null,true,false,true,true,"email"),
      new column( "Roles",40,this.rolesTemplate,true,false,true,true,"roles"),
      new column( "PhoneNumber",40,null,true,false,true,true,"phoneNumber"),

      //new column( colProp 'index', colName: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false ),
      // { prop: 'jobTitle', name: 'Title', width: 50 },
      // { prop: 'userName', name: 'UserName', width: 90, cellTemplate: this.userNameTemplate },
      // { prop: 'fullName', name: 'FullName', width: 120 },
      // { prop: 'email', name: 'Email', width: 140 },
      // { prop: 'roles', name: 'Roles', width: 120, cellTemplate: this.rolesTemplate },
      // { prop: 'phoneNumber', name: 'PhoneNumber', width: 100 }
    ];

    if (this.canManageUsers) {
      let col: column = { colName: '', width: 160, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false,colProp:"" }
      this.columns.push(col);
    }

    this.loadData();
  }


  ngAfterViewInit() {

    this.userEditor.changesSavedCallback = () => {
      this.addNewUserToList();
      this.editorModal.hide();
    };

    this.userEditor.changesCancelledCallback = () => {
      this.editedUser = null;
      this.sourceUser = null;
      this.editorModal.hide();
    };
  }


  addNewUserToList() {
    if (this.sourceUser) {
      Object.assign(this.sourceUser, this.editedUser);

      let sourceIndex = this.rowsCache.indexOf(this.sourceUser, 0);
      if (sourceIndex > -1) {
        Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);
      }

      sourceIndex = this.rows.indexOf(this.sourceUser, 0);
      if (sourceIndex > -1) {
        Utilities.moveArrayItem(this.rows, sourceIndex, 0);
      }

      this.editedUser = null;
      this.sourceUser = null;
    } else {
      const user = new User();
      Object.assign(user, this.editedUser);
      this.editedUser = null;

      let maxIndex = 0;
      for (const u of this.rowsCache) {
        if ((u as any).index > maxIndex) {
          maxIndex = (u as any).index;
        }
      }

      (user as any).index = maxIndex + 1;

      this.rowsCache.splice(0, 0, user);
      this.rows.splice(0, 0, user);
      this.rows = [...this.rows];
    }
  }


  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    if (this.canViewRoles) {
      this.accountService.getUsersAndRoles().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));
    } else {
      this.accountService.getUsers().subscribe(users => this.onDataLoadSuccessful(users, this.accountService.currentUser.roles.map(x => new Role(x))), error => this.onDataLoadFailed(error));
    }
  }


  onDataLoadSuccessful(users: User[], roles: Role[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    users.forEach((user, index) => {
      (user as any).index = index + 1;
    });

    this.rowsCache = [...users];
    this.rows = users;

    this.allRoles = roles;
  }


  onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }


  onSearchChanged(value: string) {
    this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.userName, r.fullName, r.email, r.phoneNumber, r.jobTitle, r.roles));
  }

  onEditorModalHidden() {
    this.editingUserName = null;
    this.userEditor.resetForm(true);
  }


  newUser() {
    this.editingUserName = null;
    this.sourceUser = null;
    this.editedUser = this.userEditor.newUser(this.allRoles);
    this.editorModal.show();
  }


  editUser(row: UserEdit) {
    this.editingUserName = { name: row.userName };
    this.sourceUser = row;
    this.editedUser = this.userEditor.editUser(row, this.allRoles);
    this.editorModal.show();
  }


  deleteUser(row: UserEdit) {
    const snackBarRef = this.snackBar.open(`Are you sure you want to delete "${row.userName}"?`, 'Confirm', {
      duration: 5000 // Adjust the duration as needed
    });

    snackBarRef.onAction().subscribe(() => {
      this.deleteUserHelper(row);
    });
}


  deleteUserHelper(row: UserEdit) {

    this.alertService.startLoadingMessage('Deleting...');
    this.loadingIndicator = true;

    this.accountService.deleteUser(row)
      .subscribe(results => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.rowsCache = this.rowsCache.filter(item => item !== row);
        this.rows = this.rows.filter(item => item !== row);
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.loadingIndicator = false;

          this.alertService.showStickyMessage('Delete Error', `An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        });
  }



  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canManageUsers() {
    return this.accountService.userHasPermission(Permission.manageUsersPermission);
  }

}

export class column {


  constructor(
    colName: string,
    width: number,
    cellTemplate: TemplateRef<any>|null,
    resizeable: boolean,
    canAutoResize: boolean,
    sortable: boolean,
    draggable: boolean,
    propName: string
) {
    this.colName = colName
    this.width = width
    this.cellTemplate = cellTemplate
    this.resizeable = resizeable
    this.canAutoResize = canAutoResize
    this.sortable = sortable
    this.draggable = draggable
    this.colProp = propName
  }


  colName: string;
  width: number;
  cellTemplate: TemplateRef<any>|null;
  resizeable: boolean;
  canAutoResize: boolean;
  sortable: boolean;
  draggable: boolean;
  colProp:string;
}
