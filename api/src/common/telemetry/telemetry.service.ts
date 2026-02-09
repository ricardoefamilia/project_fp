import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { api } from '@opentelemetry/sdk-node';

@Injectable({ scope: Scope.TRANSIENT })
export class TelemetryService extends ConsoleLogger {
  constructor() {
    super();
  }
  logEvent(eventName: string): void {
    const activeSpan = api.trace.getSpan(api.context.active());

    if (activeSpan) {
      activeSpan.addEvent(eventName);
    } else {
      this.warn('No active span found');
    }
  }
}
