import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

export const InitSentry = () => {
    Sentry.init({
        dsn: "https://536085b488bb4f45b0da9bf48d35a551@o203440.ingest.sentry.io/5509354",
        integrations: [
            new Integrations.BrowserTracing(),
        ],

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        //tracesSampleRate: 1.0,
    });

}