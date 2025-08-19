export const API_ENDPOINT = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  LNE_PERSONS: {
    GET_ALL: '/lne-persons',
  },
  MEMBERS: {
    REGISTER: '/members/register',
    FILTER: '/members',
    SWITCH_STATUS: '/members/:id/switch-status',
    TOGGLE_ARCHIVE: '/members/:id/toggle-archive',
    GET_BY_ID: '/members/:id',
    EDIT: '/members/:id',
    EXPORT_CSV: '/members/export/csv',
  },
};
