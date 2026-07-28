import type { ApiStage } from "./types";
export const traceStage: ApiStage = async (request, next) => {
  const traceId = `trace-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return await next({
    ...request,
    headers: { ...request.headers, "X-Trace-Id": traceId },
  });
};
