export abstract class AdminsMicroserviceConstants {
  static NAME = 'admins';
  static CONFIG_NAME = 'ADMINS';

  // messages pattern for [Admins Service].
  static ADMINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN = 'adminsService.findOneById';
  static ADMINS_SERVICE_FIND_ONE_BY_EMAIL_MESSAGE_PATTERN = 'adminsService.findOneByEmail';
  static ADMINS_SERVICE_FIND_ALL_BY_PERMISSION_GROUP_MESSAGE_PATTERN = 'adminsService.findAllByPermissionGroup';
  static ADMINS_SERVICE_UPDATE_PASSWORD_MESSAGE_PATTERN = 'adminsService.updatePassword';
  static ADMINS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN = 'adminsService.updateProfile';
  static ADMINS_SERVICE_COUNT_MESSAGE_PATTERN = 'adminsService.count';
}
