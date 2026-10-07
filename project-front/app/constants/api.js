/**
 * Branch Module
 */
export const dashboardAPI = {
  get: "/dashboard/get",
  activityTypeChange: "/dashboard/activity_type_change",
};

/**
 * Branch Module
 */
export const branchAPI = {
  get: "/branch/get",
  get_combo_list: "/branch/get_combo_list",
  store: "/branch/store",
  update: "/branch/update",
  delete: "/branch/delete",
  get_by_id: "branch/get_by_id",
  imagePath: "/branch",
  updateStatus: "/branch/update_status",
};

/**
 * Company Module
 */
export const companyAPI = {
  get: "/company/get",
  store: "/company/store",
  update: "/company/update",
  get_by_id: "company/get_by_id",
  imagePath: "/company",
  delete: "/company/delete",
  updateStatus: "/company/update_status",
};

/**
 * Module Module
 */
export const moduleAPI = {
  get: "/module/get",
  store: "/module/store",
  update: "/module/update",
  delete: "/module/delete",
  get_by_id: "/module/get_by_id",
  sync_module: "/module/sync_module",
};

export const roleAPI = {
  get: "/role/get",
  store: "/role/store",
  update: "/role/update",
  delete: "/role/delete",
  get_by_id: "/role/get_by_id",
  get_update: "/role/get_update",
  getModulePermission: "/role/get_module_permission",
};

/**
 * Module Module
 */
export const userAPI = {
  get: "/user/get",
  store: "/user/store",
  update: "/user/update",
  delete: "/user/delete",
  get_edit: "/user/get_edit",
  get_role: "/user/get_role",
};

/**
 * Module Module
 */
export const userLogAPI = {
  get: "/user_log/get",
};

export const currencyApi = {
  get: "/currency/get",
};

export const userDeviceApi = {
  updateToken: "user_device/update_token",
};

export const notificationApi = {
  getNotificationList: "notification/get_list",
  readNotification: "notification/read_message",
  notificationRequest: "notification/notification_request",
  readNotificationRequest: "notification/read_notification_request",
  readAllNotification: "notification/read_all_notification",
  clearAllNotification: "notification/clear_all_notification",
};

export const ipAddressApi = {
  get: "/ipaddress/get",
  store: "/ipaddress/store",
  update: "/ipaddress/update",
  delete: "/ipaddress/delete",
  get_by_id: "/ipaddress/get_by_id",
};
/**
 * customer
 */
export const customerApi = {
  get: "/customer/get",
  store: "/customer/store",
  update: "/customer/update",
  delete: "/customer/delete",
  get_by_id: "/customer/get_by_id",
  getAccountByCustomerId: "/customer/get_account_by_customer_id",
};

/**
 * account
 */
export const accountApi = {
  get: "/account/get",
  store: "/account/store",
  update: "/account/update",
  delete: "/account/delete",
  change_default_account: "/account/change_default_account",
  change_status: "/account/change_status",
  printPDF: "/account/printPDF",
  downloadExcel: "/account/download",
  clear_transaction: "/account/clear_transaction",
  getCustomer: "/account/get_customer",
};

/**
 * account transaction
 */
export const accountTransactionApi = {
  get: "/account_transaction/get",
  store: "/account_transaction/store",
  update: "/account_transaction/update",
  delete: "/account_transaction/delete",
  getByAccountId: "account_transaction/get_by_account",
  uploadExcel: "account_transaction/upload_excel",
  getAccountTransaction: "account_transaction/get_account_transaction",
  getTransactionById: "account_transaction/get_transaction_by_id",
};

/**
 * account transaction
 */
export const bankStatementApi = {
  get: "/bank_statement/get",
  store: "/bank_statement/store",
  update: "/bank_statement/update",
  delete: "/bank_statement/delete",
  download_docs: "/bank_statement/download_docs",
  getByAccountID: "/bank_statement/get_by_account",
};
// editor
export const editorAPI = {
  store: "/editor/store",
  update: "/editor/update",
  delete: "/editor/delete",
};
// Banner Module
export const bannerListAPI = {
  get: "/banner/get",
  store: "/banner/store",
  update: "/banner/update",
  delete: "/banner/delete",
  getListUpdate: "banner/get_list_update",
  get_by_id: "/banner/get_by_id",
  updateStatus: "banner/update_status",
};
// Banner Position Module
export const bannerPositionAPI = {
  getBannerByType: "/banner_position/get_banner_by_type",
  get: "/banner_position/get",
  store: "/banner_position/store",
  update: "/banner_position/update",
  delete: "/banner_position/delete",
  updateStatus: "/banner_position/update_status",
};
export const customerAPI = {
  get: "/customer/get",
  store: "/customer/store",
  update: "/customer/update",
  delete: "/customer/delete",
  updateStatus: "/customer/update_status",
};

export const publicRelationAPI = {
  get: "/website/get_public_relation",
};

export const companyNameAPI = {
  get: "/website/get_all_company",
  getById: "/website/get_company_by_id"
}