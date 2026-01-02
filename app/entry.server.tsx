import * as Sentry from "@sentry/react-router";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import type { EntryContext } from "react-router";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { isbot } from "isbot";

export const handleError = Sentry.createSentryHandleError({
  logErrors: false,
});

export const streamTimeout = 5_000;

function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: unknown,
): Promise<Response> {
  if (request.method.toUpperCase() === "HEAD") {
    return Promise.resolve(
      new Response(null, {
        status: responseStatusCode,
        headers: responseHeaders,
      }),
    );
  }

  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");

    const isSpaMode =
      "isSpaMode" in routerContext && routerContext.isSpaMode;

    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || isSpaMode
        ? "onAllReady"
        : "onShellReady";

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        [readyOption]() {
          shellRendered = true;

          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              callback();
            },
          });

          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");

          pipe(Sentry.getMetaTagTransformer(body));

          resolve(
            new Response(stream, {
              status: responseStatusCode,
              headers: responseHeaders,
            }),
          );
        },

        onShellError(error) {
          reject(error);
        },

        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    timeoutId = setTimeout(abort, streamTimeout);
  });
}

export default Sentry.wrapSentryHandleRequest(
  handleRequest as Parameters<typeof Sentry.wrapSentryHandleRequest>[0]
);
