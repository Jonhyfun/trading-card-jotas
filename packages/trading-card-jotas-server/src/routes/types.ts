import type { Request, Response } from "express";

export interface RouteFunction<
  Params extends Record<string, string> = {},
  ResBody = void
> {
  (req: Request<Params>, res: Response, close: VoidFunction): ResBody;
  readonly routeName: string;
  route: {
    params: keyof Params extends never ? [] : [keyof Params];
    method: "get" | "post";
  };
}

export const wrapRoute = <
  Params extends Record<string, string> = {},
  ResBody = void
>(
  routeName: string,
  route: (req: Request<Params>, res: Response, close: VoidFunction) => ResBody
) => {
  const wrappedRoute = route as RouteFunction<Params, ResBody>;
  (wrappedRoute as any).routeName = routeName;

  return wrappedRoute;
};
