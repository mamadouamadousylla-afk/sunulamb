interface LogEntry {
  timestamp: Date
  level: "info" | "warn" | "error"
  message: string
  meta?: any
}

export class Logger {
  static log(level: LogEntry["level"], message: string, meta?: any) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      meta
    }
    
    // In production, you might send this to a logging service
    console[level](`${entry.timestamp.toISOString()} [${level.toUpperCase()}] ${message}`, meta)
  }
  
  static info(message: string, meta?: any) {
    this.log("info", message, meta)
  }
  
  static warn(message: string, meta?: any) {
    this.log("warn", message, meta)
  }
  
  static error(message: string, meta?: any) {
    this.log("error", message, meta)
  }
}