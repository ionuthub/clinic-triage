export interface ApiRequest { path: string; method: 'GET'|'POST'|'PATCH'; body?: unknown; headers: Record<string,string> }
export interface ApiResponse<T=unknown> { status: number; data: T; requestId: string }
export type ApiNext = (request: ApiRequest) => Promise<ApiResponse>;
export type ApiStage = (request: ApiRequest, next: ApiNext) => Promise<ApiResponse>;
