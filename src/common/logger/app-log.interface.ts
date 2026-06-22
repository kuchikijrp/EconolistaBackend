export interface AppLogEntry {
  timestamp: string;
  requestId: string;
  service: string;
  level: string;
  method?: string;
  context: string;
  message: string;
  data?: Record<string, any>;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}
