import { Injectable } from '@nestjs/common';
import { CreateDatabaseNotificationDto, Notification } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseNotificationsService {
  constructor(@InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>) {}

  // create.
  async create(createDatabaseNotificationDto: CreateDatabaseNotificationDto): Promise<Notification> {
    return this.notificationRepository.save(await this.notificationRepository.create(createDatabaseNotificationDto));
  }
}
