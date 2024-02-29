export abstract class Notifier {
  error (message: string) {}
  info (message: string) {}
  log (message: string) {}
  success (message: string) {}
  warn (message: string) {}
}
