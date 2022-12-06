// assets
import { IconDashboard } from "@tabler/icons";
import { IconSchool } from "@tabler/icons";

// constant

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: "dashboard",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "",
      title: "Dashboard",
      type: "item",
      url: "/",
      icon: IconDashboard,
      breadcrumbs: false,
    },
  ],
};

const classes = {
  id: "classes",
  title: "Classes",
  type: "group",
  children: [
    {
      id: "class",
      title: "Manage Class",
      type: "item",
      url: "/class",
      icon: IconSchool,
      breadcrumbs: false,
    },
  ],
};
const students = {
  id: "students",
  title: "Students",
  type: "group",
  children: [
    {
      id: "students",
      title: "Manage Students",
      type: "item",
      url: "/students",
      icon: IconSchool,
      breadcrumbs: false,
    },
  ],
};

export { dashboard, classes, students };
