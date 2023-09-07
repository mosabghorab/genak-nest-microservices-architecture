import { Injectable } from '@nestjs/common';
import { AuthedUser, Notification } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseNotificationsService {
  constructor(@InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>) {}

  // find all.
  findAll(authedUser: AuthedUser): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: {
        notifiableId: authedUser.id,
        notifiableType: authedUser.type,
      },
    });
  }
}
