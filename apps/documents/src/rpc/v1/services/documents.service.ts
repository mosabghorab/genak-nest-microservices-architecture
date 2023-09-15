import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, FindAllDocumentsPayloadDto } from '@app/common';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // find all by service type.
  findAll(findAllDocumentsPayloadDto: FindAllDocumentsPayloadDto): Promise<Document[]> {
    return this.documentRepository.find({
      where: { serviceType: findAllDocumentsPayloadDto.serviceType, active: true },
    });
  }
}
