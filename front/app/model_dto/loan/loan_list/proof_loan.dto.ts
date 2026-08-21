export interface CreateProofDTO {
  name: string;
  path: string;
}
export interface GetProofDTO {
  proofId: string;
  proofName: string;
  proofPath: string;
}
export interface GetProofResDTO {
  id: string;
  name: string;
  path: string;
}

export const mapperProofImage = (proof: GetProofResDTO): GetProofDTO => {
  return {
    proofId: proof.id,
    proofName: proof.name,
    proofPath: proof.path,
  };
};
