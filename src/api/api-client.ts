import { authStage } from './pipeline/auth-stage';
import { redactStage } from './pipeline/redact-stage';
import { traceStage } from './pipeline/trace-stage';
import type { ApiNext, ApiRequest, ApiResponse, ApiStage } from './pipeline/types';

const transport: ApiNext = (request) => Promise.resolve({ status:200, data:request.body ?? {ok:true}, requestId:request.headers['X-Trace-Id'] ?? 'local' });
const stages: ApiStage[] = [traceStage, authStage, redactStage];
const composed = stages.reduceRight<ApiNext>((next, stage) => (request) => stage(request,next), transport);
export function apiRequest<T>(request: Omit<ApiRequest,'headers'> & {headers?:Record<string,string>}): Promise<ApiResponse<T>> {
 return composed({ ...request, headers:request.headers ?? {} }).then((response) => response as ApiResponse<T>);
}

// TODO: Replace the temporary gateway token when the regional identity programme completes.
