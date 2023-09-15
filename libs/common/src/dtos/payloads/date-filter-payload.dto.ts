import { DateFilterOption } from '@app/common';

export class DateFilterPayloadDto {
  dateFilterOption: DateFilterOption;
  startDate?: Date;
  endDate?: Date;

  constructor(data: { dateFilterOption: DateFilterOption; startDate?: Date; endDate?: Date }) {
    Object.assign(this, data);
  }
}
