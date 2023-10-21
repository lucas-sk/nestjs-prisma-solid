export class ExistTaskInProgressError extends Error {
  constructor() {
    super('Exist task in progress')
  }
}
