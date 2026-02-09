
export type Status = 'ATIVA' | 'INATIVA';

export type ReasonCode =
  | 'DIVERGENCIA_CADASTRAL'
  | 'NAO_RENOVOU_RTA'
  | 'MONITORAMENTO'
  | 'ENVIADO_AO_DENASUS'
  | 'PENDENCIA_FINANCEIRA'
  | 'DESCREDENCIAMENTO_PROPRIO'
  | 'DESCREDENCIAMENTO_POR_IRREGULARIDADES'
  | 'DESCREDENCIAMENTO_POR_FUSAO_INCORPORACAO'
  | 'DESCREDENCIAMENTO_POR_NAO_HOMOLOGACAO'
  | 'DESCREDENCIAMENTO_POR_BAIXA_CNPJ'
  | 'INATIVACAO_POR_DECISAO_JUDICIAL'
  | 'REGULARIDADE'
  | 'ATIVACAO_POR_DECISAO_JUDICIAL'
  | 'RECREDENCIAMENTO';

export type UpdateStatusEvent = {
  type: 'UPDATE_STATUS';
  status: Status;
  reasonCode: ReasonCode | null;
  userId: string | null;
  updatedAt: Date | null;
};

export type WorkflowEvent = UpdateStatusEvent;

export interface AccreditationContext {
  pharmacyId: string;
  status: Status;
  reasonCode: ReasonCode | null;
  updatedAt: Date | null;
  userId: string | null;
}
