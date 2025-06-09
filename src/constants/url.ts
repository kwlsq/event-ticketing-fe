export const API_URL = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://event-ticketing-be-871456516315.asia-southeast2.run.app/api/v1",
  BASE_URL_LOCAL:
    process.env.NEXT_PUBLIC_BACKEND_URL,
  endpoints: {
    eventPublic: '/api/v1/event/public',
    image: '/api/v1/image',
    event: '/api/v1/event'
  },
  auth: {
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
    refresh: "/api/v1/auth/refresh",
    me: "/api/v1/auth/me",
  },
  user: {
    detail: "/api/v1/user",
    register: "/api/v1/user/register"
  },
  points: {
    totalPoints: "/api/v1/point"
  },
  dashboard: {
    dashboardData: "/api/v1/dashboard",
    dashboardEvent: "/api/v1/dashboard/events"
  }
};
