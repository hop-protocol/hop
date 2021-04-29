export abstract class Notifier {
  constructor (label: string) {}
  error (message: string) {}
  info (message: string) {}
  log (message: string) {}
  success (message: string) {}
  warn (message: string) {}
}
