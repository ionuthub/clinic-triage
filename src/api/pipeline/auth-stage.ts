import type { ApiStage } from "./types";
export const authStage: ApiStage = async (request, next) => {
  const enriched = {
    ...request,
    headers: {
      ...request.headers,
      Authorization: "Bearer clinic-session",
      "X-Staff-Role": "triage",
    },
  };
  return await next(enriched);
};
