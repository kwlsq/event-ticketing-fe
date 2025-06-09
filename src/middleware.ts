import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const PUBLIC_PATHS = ["/", "/event-details", "/invoice"];
const ROLE_PATHS = {
  organizer: ["/dashboard/organizer", "/dashboard/organizer/*"],
  user: ["/dashboard/user", "/dashboard/user/*"],
};
const PROTECTED_PATHS = [...ROLE_PATHS.organizer, ...ROLE_PATHS.user, "/trx/reports"];

async function getSession() {
  return await auth();
}

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isProtectedPath(pathname: string) {
  const result = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  return result;
}

function hasRequiredRole(userRoles: string[], pathname: string) {
  const cleanRole = userRoles.map((each) => each.replace("ROLE_", "").toLowerCase());
  for (const [role, paths] of Object.entries(ROLE_PATHS)) {
    if (
      paths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      ) &&
      cleanRole.includes(role)
    ) {
      return true;
    }
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedPath(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL(`${pathname}?login=true`, request.url));
    }

    const userRoles = session.user?.roles || [];
    if (!hasRequiredRole(userRoles, pathname)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}