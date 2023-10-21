export class DeadlineCannotBeInThePastError extends Error {
  constructor() {
    super('Deadline cannot be in the past')
  }
}
