import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Document,
  FindAllDocumentsDto,
  FindOneByIdDto,
  FindOneOrFailByIdDto,
} from '@app/common';
import { CreateDocumentDto } from '../dtos/create-document.dto';
import { UpdateDocumentDto } from '../dtos/update-document.dto';

@Injectable()
export class AdminDocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // find one by id.
  findOneById(
    findOneByIdDto: FindOneByIdDto<Document>,
  ): Promise<Document | null> {
    return this.documentRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(
    findOneOrFailByIdDto: FindOneOrFailByIdDto<Document>,
  ): Promise<Document> {
    const document: Document = await this.findOneById(<
      FindOneByIdDto<Document>
    >{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!document) {
      throw new NotFoundException(
        findOneOrFailByIdDto.failureMessage || 'Document not found.',
      );
    }
    return document;
  }

  // find all.
  findAll(findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]> {
    return this.documentRepository.find({
      where: {
        serviceType: findAllDocumentsDto.serviceType,
        active: findAllDocumentsDto.active,
      },
    });
  }

  // create.
  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentRepository.save(
      await this.documentRepository.create(createDocumentDto),
    );
  }

  // update.
  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const document: Document = await this.findOneOrFailById(<
      FindOneOrFailByIdDto<Document>
    >{
      id,
    });
    Object.assign(document, updateDocumentDto);
    return this.documentRepository.save(document);
  }

  // remove.
  async remove(id: number): Promise<Document> {
    const document: Document = await this.findOneOrFailById(<
      FindOneOrFailByIdDto<Document>
    >{
      id,
    });
    return this.documentRepository.remove(document);
  }
}
