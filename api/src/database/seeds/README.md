# Database Seeder

Este módulo é responsável por popular o banco de dados com dados iniciais (seeds) quando a API é iniciada em modo de desenvolvimento.

## Estrutura

- **`uf.seed.ts`**: Contém os dados mock dos 27 estados brasileiros (26 estados + DF)
- **`database-seeder.service.ts`**: Serviço que executa a lógica de seed no banco de dados
- **`database-seeder.module.ts`**: Módulo NestJS que encapsula o serviço de seeder

## Como Funciona

O seed é executado automaticamente quando a API sobe em modo `development` ou `local`. O processo:

1. Verifica se já existem registros na tabela `TB_UF`
2. Se não houver registros, insere os 27 estados brasileiros
3. Se já houver registros, pula o seed

## Dados dos Estados

Os dados incluem informações completas de cada estado brasileiro:

- Código IBGE
- Sigla (UF)
- Nome do estado
- Região
- Área territorial
- Coordenadas (latitude/longitude)
- Códigos diversos (SINPAS, INSS, SIAFI, etc.)
- Capital (código IBGE)
- E muito mais...

## Exemplo de Uso

Ao iniciar a API em modo desenvolvimento:

```bash
npm run start:dev
```

Você verá no console:

```
Iniciando seed de UFs...
✅ Seed de UFs concluído! 27 estados cadastrados.
```

## Desabilitando o Seed

Para desabilitar o seed, você pode:

1. Alterar a variável de ambiente `NODE_ENV` para um valor diferente de `development` ou `local`
2. Comentar o código no `main.ts` que executa o seeder

## Adicionando Novos Seeds

Para adicionar seeds para outras entidades:

1. Crie um arquivo `[entidade].seed.ts` com os dados mock
2. Adicione um método privado no `database-seeder.service.ts` para processar esses dados
3. Chame o novo método no método `seedDatabase()`

Exemplo:

```typescript
// city.seed.ts
export const cityMocks: Partial<City>[] = [
  // ... dados mock
];

// database-seeder.service.ts
private async seedCities(): Promise<void> {
  // ... lógica de seed
}

async seedDatabase(): Promise<void> {
  await this.seedUfs();
  await this.seedCities(); // novo seed
}
```

