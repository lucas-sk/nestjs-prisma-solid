import { IsUUID } from 'class-validator'

export class UserPayload {
  @IsUUID()
  sub: string
}
