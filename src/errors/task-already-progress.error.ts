export class TaskAlreadyProgressError extends Error {
  constructor() {
    super('Task already Progress')
  }
}
