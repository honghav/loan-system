import { PartialType } from "@nestjs/swagger";
import { GetPaymenttable } from "./get_payment_table.dto";
import { PaymentStatus } from "../payment_table.entity";

export class UpdatePaymenttable extends PartialType(GetPaymenttable) {
    status!: PaymentStatus;
}