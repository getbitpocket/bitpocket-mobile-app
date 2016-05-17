export interface PaymentService {
    checkPayment(address: string, amount: number) : Promise<{status: string, tx?: string}>;
}