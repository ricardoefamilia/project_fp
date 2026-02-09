// import { NodeTracerProvider }from '@opentelemetry/sdk-trace-node'
// import { NestInstrumentation }from '@opentelemetry/instrumentation-nestjs-core'
// import { registerInstrumentations } from '@opentelemetry/instrumentation'
// import {ConsoleLogRecordExporter, SimpleLogRecordProcessor} from '@opentelemetry/sdk-logs'
// import { NodeSDK } from '@opentelemetry/sdk-node'

// const provider = new NodeTracerProvider();
// provider.register();
// const loggerProcessor =  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
// loggerProcessor.
// registerInstrumentations({
//   instrumentations: [
//     new NestInstrumentation(),
//   ],
// });

/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ConsoleLogRecordExporter, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';

export const sdk = new NodeSDK({
  // resource: new Resource({
  //   [ATTR_SERVICE_NAME]: "VICENTE",
  //   [ATTR_SERVICE_VERSION]:"1.0",
  // }),
  traceExporter: new ConsoleSpanExporter(),
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new ConsoleMetricExporter(),
  // }),
  logRecordProcessors: [new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())],
  instrumentations: [new NestInstrumentation(), getNodeAutoInstrumentations()],
});
// sdsdk.start();

//    export async function register() {
//        await sdk.start();

//     };
// // // sdk.start();
