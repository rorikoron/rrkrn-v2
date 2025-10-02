import { AppType } from "@/app/api/[...route]/route";
import { hc } from "hono/client";
export const apiClient = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL!);