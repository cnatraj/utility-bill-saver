import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Layouts
import AuthLayout from "../layouts/AuthLayout.vue";

// Main Views
import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import BillAnalysisView from "../views/BillAnalysisView.vue";
import RecommendationsView from "../views/RecommendationsView.vue";
import RebatesView from "../views/RebatesView.vue";
import ReportView from "../views/ReportView.vue";
import CreateReportView from "../views/CreateReportView.vue";

// Auth Views
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/report",
    name: "report",
    component: ReportView,
    meta: { requiresAuth: true },
  },
  {
    path: "/create-report",
    name: "createReport",
    component: CreateReportView,
    meta: { requiresAuth: true },
  },
  {
    path: "/bill-analysis",
    name: "bill-analysis",
    component: BillAnalysisView,
    meta: { requiresAuth: true },
  },
  {
    path: "/recommendations",
    name: "recommendations",
    component: RecommendationsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/rebates",
    name: "rebates",
    component: RebatesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: LoginView,
        meta: { requiresAuth: false, redirectIfAuth: true },
      },
      {
        path: "/register",
        name: "register",
        component: RegisterView,
        meta: { requiresAuth: false, redirectIfAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Function to wait for authentication to be initialized
const waitForAuth = () => {
  const authStore = useAuthStore();
  return new Promise((resolve) => {
    if (authStore.isAuthenticated !== null) {
      resolve();
      return;
    }

    const unsubscribe = authStore.$subscribe((mutation, state) => {
      if (state.isAuthenticated !== null) {
        unsubscribe();
        resolve();
      }
    });
  });
};

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const redirectIfAuth = to.meta.redirectIfAuth;

  // Wait for authentication to be initialized
  await waitForAuth();

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (redirectIfAuth && authStore.isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
