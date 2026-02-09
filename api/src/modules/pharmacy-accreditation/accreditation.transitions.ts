// src/credenciamento/workflow/rn013.transitions.ts
import { ReasonCode, Status } from './accreditation.types';

export interface AccreditationTransition {
  statusActual: Status;
  reasonCodeActual: ReasonCode | 'QUALQUER_REASON_CODE';
  statusDestination: Status;
  reasonCodesDestinationAllowed: ReasonCode[];
}

export const ACCREDITATION_TRANSITIONS: AccreditationTransition[] = [
  // Row 1: ATIVA -> INATIVA (qualquer motivo)
  {
    statusActual: 'ATIVA',
    reasonCodeActual: 'QUALQUER_REASON_CODE',
    statusDestination: 'INATIVA',
    reasonCodesDestinationAllowed: [
      'DIVERGENCIA_CADASTRAL',
      'NAO_RENOVOU_RTA',
      'MONITORAMENTO',
      'ENVIADO_AO_DENASUS',
      'DESCREDENCIAMENTO_PROPRIO',
      'DESCREDENCIAMENTO_POR_FUSAO_INCORPORACAO',
      'DESCREDENCIAMENTO_POR_NAO_HOMOLOGACAO',
      'DESCREDENCIAMENTO_POR_BAIXA_CNPJ',
      'INATIVACAO_POR_DECISAO_JUDICIAL',
    ],
  },
  // Row 2: INATIVA (DIVERGENCIA_CADASTRAL) -> ATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'DIVERGENCIA_CADASTRAL',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['REGULARIDADE', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
  // Row 3: INATIVA (DIVERGENCIA_CADASTRAL) -> INATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'DIVERGENCIA_CADASTRAL',
    statusDestination: 'INATIVA',
    reasonCodesDestinationAllowed: [
      'DIVERGENCIA_CADASTRAL', // Divergência cadastral e Pendência financeira (tratado como DIVERGENCIA_CADASTRAL)
      'PENDENCIA_FINANCEIRA', // Pendência Financeira
      'NAO_RENOVOU_RTA',
      'MONITORAMENTO',
      'ENVIADO_AO_DENASUS',
      'DESCREDENCIAMENTO_POR_IRREGULARIDADES',
      'DESCREDENCIAMENTO_PROPRIO',
      'DESCREDENCIAMENTO_POR_BAIXA_CNPJ',
    ],
  },
  // Row 4: INATIVA (NAO_RENOVOU_RTA) -> ATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'NAO_RENOVOU_RTA',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['REGULARIDADE', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
  // Row 5: INATIVA (NAO_RENOVOU_RTA) -> INATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'NAO_RENOVOU_RTA',
    statusDestination: 'INATIVA',
    reasonCodesDestinationAllowed: [
      'MONITORAMENTO', // Monitoramento e Não Renovou RTA (tratado como MONITORAMENTO)
      'ENVIADO_AO_DENASUS', // Enviado ao DENASUS e Não Renovou RTA (tratado como ENVIADO_AO_DENASUS)
      'DESCREDENCIAMENTO_PROPRIO',
      'DESCREDENCIAMENTO_POR_BAIXA_CNPJ',
      'NAO_RENOVOU_RTA', // Descredenciamento Não Renovou RTA (tratado como NAO_RENOVOU_RTA)
    ],
  },
  // Row 6: INATIVA (MONITORAMENTO) -> ATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'MONITORAMENTO',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['REGULARIDADE', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
  // Row 7: INATIVA (MONITORAMENTO) -> INATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'MONITORAMENTO',
    statusDestination: 'INATIVA',
    reasonCodesDestinationAllowed: [
      'ENVIADO_AO_DENASUS',
      'MONITORAMENTO', // Monitoramento e Não Renovou RTA (tratado como MONITORAMENTO)
      'PENDENCIA_FINANCEIRA',
      'DESCREDENCIAMENTO_POR_IRREGULARIDADES',
    ],
  },
  // Row 8: INATIVA (ENVIADO_AO_DENASUS) -> ATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'ENVIADO_AO_DENASUS',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['REGULARIDADE', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
  // Row 9: INATIVA (ENVIADO_AO_DENASUS) -> INATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'ENVIADO_AO_DENASUS',
    statusDestination: 'INATIVA',
    reasonCodesDestinationAllowed: [
      'ENVIADO_AO_DENASUS', // Enviado ao DENASUS e Não Renovou RTA (tratado como ENVIADO_AO_DENASUS)
      'MONITORAMENTO',
      'DESCREDENCIAMENTO_POR_IRREGULARIDADES',
    ],
  },
  // Row 10: INATIVA (DESCREDENCIAMENTO) -> ATIVA
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'DESCREDENCIAMENTO_PROPRIO',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['RECREDENCIAMENTO', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'DESCREDENCIAMENTO_POR_IRREGULARIDADES',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['RECREDENCIAMENTO', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'DESCREDENCIAMENTO_POR_FUSAO_INCORPORACAO',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['RECREDENCIAMENTO', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'DESCREDENCIAMENTO_POR_NAO_HOMOLOGACAO',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['RECREDENCIAMENTO', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
  {
    statusActual: 'INATIVA',
    reasonCodeActual: 'DESCREDENCIAMENTO_POR_BAIXA_CNPJ',
    statusDestination: 'ATIVA',
    reasonCodesDestinationAllowed: ['RECREDENCIAMENTO', 'ATIVACAO_POR_DECISAO_JUDICIAL'],
  },
];

export function accreditationAllowsTransition(params: {
  statusActual: Status;
  reasonCodeActual: ReasonCode;
  statusDestination: Status;
  reasonCodesDestinationAllowed: ReasonCode[];
}): boolean {
  const matches = ACCREDITATION_TRANSITIONS.filter(
    (r) =>
      r.statusActual === params.statusActual &&
      (r.reasonCodeActual === params.reasonCodeActual || r.reasonCodeActual === 'QUALQUER_REASON_CODE') &&
      r.statusDestination === params.statusDestination,
  );

  return matches.some((r) => params.reasonCodesDestinationAllowed.some((rc) => r.reasonCodesDestinationAllowed.includes(rc)));
}
