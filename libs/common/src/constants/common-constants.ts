export abstract class CommonConstants {
  static PHONE_VALIDATION_REGX = /^05(9[987542]|6[9876542])\d{6}$/;
  static IMAGE_MIMETYPE_REGX = /^image\/(jpeg|pjpeg|png|webp)$/;
  static FILE_MIMETYPE_REGX = /^(application\/pdf|application\/zip|application\/msword|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/;
  static MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5m.
  static MAX_FILE_SIZE = 1024 * 1024 * 10; // 10m.
}
