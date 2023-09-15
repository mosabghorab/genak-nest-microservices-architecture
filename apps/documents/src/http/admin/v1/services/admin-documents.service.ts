import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';
import { CreateDocumentRequestDto } from '../dtos/create-document-request.dto';
import { UpdateDocumentRequestDto } from '../dtos/update-document-request.dto';
import { FindAllDocumentsDto } from '../dtos/find-all-documents.dto';

@Injectable()
export class AdminDocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Document>): Promise<Document | null> {
    return this.documentRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Document>): Promise<Document> {
    const document: Document = await this.findOneById(
      new FindOneByIdPayloadDto<Document>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!document) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Document not found.');
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
  async create(createDocumentRequestDto: CreateDocumentRequestDto): Promise<Document> {
    return this.documentRepository.save(await this.documentRepository.create(createDocumentRequestDto));
  }

  // update.
  async update(id: number, updateDocumentRequestDto: UpdateDocumentRequestDto): Promise<Document> {
    const document: Document = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Document>({
        id,
      }),
    );
    Object.assign(document, updateDocumentRequestDto);
    return this.documentRepository.save(document);
  }

  // remove.
  async remove(id: number): Promise<Document> {
    const document: Document = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Document>({
        id,
      }),
    );
    return this.documentRepository.remove(document);
  }
}
