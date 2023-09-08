import { DateFilterOption } from '@app/common';

export class DateFilterDto {
  dateFilterOption: DateFilterOption;
  startDate?: Date;
  endDate?: Date;
}
