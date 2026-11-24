import { GatewayHandlerContext, TrustGateOptions } from './types.js';
/**
 * TrustGate Universal Bouncer Middleware
 * Supports Next.js App Router (NextRequest / NextResponse) and standard Web API Request / Response.
 */
export declare function withTrustGate(handler: (req: any, context: GatewayHandlerContext) => Promise<any>, options?: TrustGateOptions): (req: any) => Promise<any>;
//# sourceMappingURL=gateway.d.ts.map