import { IsString, IsNumber, IsDate, MinDate, MaxDate, IsPositive, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const maxDate = new Date(2023, 0, 1)

export class TripDto {
    @IsString()
    @IsNotEmpty({ message: 'Start address is required!' })
    start_address: string;

    @IsString()
    @IsNotEmpty({ message: 'Destination address is required!' })
    destination_address: string;

    @IsNumber({}, { message: 'Price must be a number!' })
    @IsNotEmpty({ message: 'Price is required!' })
    @IsPositive({ message: 'Price must be a positive number!' })
    price: number;

    @IsDate({ message: 'Date must be in proper date format!' })
    @Type(() => Date)
    @IsNotEmpty({ message: 'Date of a delivery is required!' })
    // @MinDate(yesterday, { message: 'Cannot add date before today!' })
    @MaxDate(maxDate, { message: 'Only dates before 2023 supported!' })
    date: Date;
}