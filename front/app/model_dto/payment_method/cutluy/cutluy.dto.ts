export interface CutLuyCheckStatusResDTO {
    id: string;
    amount: number;
    status: number;
    currency: string;
    reference_id: string;

}
export interface CutLuyResDTO {
    id: string;
    status: string;
    amount: string;
    currency: string;
    reference_id: string;
    qr_string: string;
    checkout_url: string;
    approved_at?: string;
    qrImage: string;
    md5: string;
    url_webhook: string;
    webhook_url: string;
}
