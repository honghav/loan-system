export enum MouldeEnum {
  PAGE = "page",
  SUB_PAGE = "subpage",
}

export interface ModulePage {
  value: string;
  name: string;
  icon: string;
  route: string;
  type: MouldeEnum;
  under_page?: string;
}

export const moduleData: ModulePage[] = [
  {
    value: "dashboard",
    name: "Dashboard",
    icon: "",
    route: "dashbord",
    type: MouldeEnum.PAGE,
    under_page: "..",
  },
  {
    value: "customer",
    name: "Customer",
    icon: "",
    route: "customer",
    under_page: "dashbord",
    type: MouldeEnum.PAGE,
  },
  {
    value: "loan",
    name: "Loan",
    icon: "",
    route: "loan",
    under_page: "dashbord",
    type: MouldeEnum.PAGE,
  },
  {
    value: "payment",
    name: "Payment",
    icon: "",
    route: "payment",
    under_page: "dashbord",
    type: MouldeEnum.PAGE,
  },
  {
    value: "report",
    name: "Report",
    icon: "",
    route: "Report",
    under_page: "dashbord",
    type: MouldeEnum.PAGE,
  },
  {
    value: "logger",
    name: "Logger",
    icon: "",
    route: "logger",
    under_page: "dashbord",
    type: MouldeEnum.PAGE,
  },
  {
    value: "size_data",
    name: "Size Data",
    icon: "",
    route: "size_data",
    under_page: "dashbord",
    type: MouldeEnum.PAGE,
  },
];
