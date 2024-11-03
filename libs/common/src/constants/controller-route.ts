export class ControllerRoute {
  static REGION = class {
    public static readonly ROUTE = 'region';
    static ACTIONS = class {
      public static readonly GET_REGIONS_SUMMARY = 'Get list of all regions';

      public static readonly GET_REGIONS_DESCRIPTION =
        'Retrieve the list of all regions registered in Syncrow.';
    };
  };
}
