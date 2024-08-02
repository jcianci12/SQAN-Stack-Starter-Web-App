

export type VendorPermissionNames = 'Manage Store' | 'Create Items' | 'Edit Items' | 'Delete Items'
export type VendorPermissionValues = 'Manage Store' | 'Create Items' | 'Edit Items' | 'Delete Items'

export type ClientPermissionNames = 'Hire Items'
export type ClientPermissionValues = 'Hire Items'

export type PermissionNames =  VendorPermissionNames |  ClientPermissionNames |  'View Users' | 'Manage Users' |  'View Roles' | 'Manage Roles' | 'Assign Roles'
export type PermissionValues =  VendorPermissionValues |  ClientPermissionValues |  'users.view' | 'users.manage' |  'roles.view' | 'roles.manage' | 'roles.assign'

export class Permission {

  //vendor permissions
  public static readonly manageStorePermission: PermissionValues = 'Manage Store'
  public static readonly createItemPermission: PermissionValues = 'Create Items'
  public static readonly editItemPermission: PermissionValues = 'Edit Items'
  public static readonly deleteItemPermission: PermissionValues = 'Delete Items'

  //Client permissions
  public static readonly hireItemPermission: PermissionValues = 'Hire Items'


  //admin permissions
  //users
  public static readonly viewUsersPermission: PermissionValues = 'users.view';
  public static readonly manageUsersPermission: PermissionValues = 'users.manage';
  //roles
  public static readonly viewRolesPermission: PermissionValues = 'roles.view';
  public static readonly manageRolesPermission: PermissionValues = 'roles.manage';
  public static readonly assignRolesPermission: PermissionValues = 'roles.assign';

  constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
    this.name = name!;
    this.value = value!;
    this.groupName = groupName!;
    this.description = description!;
  }

  public name: PermissionNames;
  public value: PermissionValues;
  public groupName: string;
  public description: string;
}
