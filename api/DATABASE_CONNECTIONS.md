# Configuração de Múltiplas Conexões de Banco de Dados

Este projeto suporta múltiplas conexões de banco de dados: **Oracle** e **PostgreSQL**.

## Configuração

### Variáveis de Ambiente

#### Oracle (Obrigatório)
```env
DB_HOST=localhost
DB_PORT=1521
DB_USERNAME=root
DB_PASSWORD=root
DB_SERVICE_NAME=FPAPI
DB_SYNCHRONIZE=false
DB_LOGGING=false
DB_POOL_SIZE=10
DB_POOL_MIN=2
```

#### PostgreSQL (Opcional)
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=root
POSTGRES_PASSWORD=root
POSTGRES_DATABASE=fpapi
POSTGRES_SYNCHRONIZE=false
POSTGRES_LOGGING=false
POSTGRES_POOL_SIZE=10
POSTGRES_POOL_MIN=2
```

## Uso nas Aplicações

### Conexão Padrão (Oracle)

Por padrão, todos os módulos usam a conexão Oracle. Exemplo:

```typescript
// pharmacys.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy])], // Usa Oracle (padrão)
  // ...
})
export class PharmacysModule {}
```

### Usando PostgreSQL em um Módulo Específico

Para usar PostgreSQL em um módulo específico, especifique o nome da conexão:

```typescript
// exemplo.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([MinhaEntidade], 'postgres'), // Especifica conexão PostgreSQL
  ],
  // ...
})
export class ExemploModule {}
```

E no serviço, injete o repositório especificando a conexão:

```typescript
// exemplo.service.ts
@Injectable()
export class ExemploService {
  constructor(
    @InjectRepository(MinhaEntidade, 'postgres') // Especifica conexão PostgreSQL
    private readonly repository: Repository<MinhaEntidade>,
  ) {}
}
```

### Injetando DataSource Diretamente

#### Oracle DataSource
```typescript
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ORACLE_DATA_SOURCE } from 'src/config/database.module';

@Injectable()
export class MeuService {
  constructor(
    @Inject(ORACLE_DATA_SOURCE)
    private readonly oracleDataSource: DataSource,
  ) {}
}
```

#### PostgreSQL DataSource
```typescript
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { POSTGRES_DATA_SOURCE } from 'src/config/database.module';

@Injectable()
export class MeuService {
  constructor(
    @Inject(POSTGRES_DATA_SOURCE)
    private readonly postgresDataSource: DataSource,
  ) {}
}
```

#### DataSource Padrão (Oracle - para compatibilidade)
```typescript
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from 'src/config/database.module';

@Injectable()
export class MeuService {
  constructor(
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource, // Oracle por padrão
  ) {}
}
```

## Migrations

### Oracle Migrations
```bash
npm run typeorm migration:run
# ou
npm run typeorm migration:generate -- -n NomeDaMigration
```

### PostgreSQL Migrations
Para executar migrations no PostgreSQL, você precisará criar um script separado ou usar o DataSource diretamente:

```typescript
import { postgresDataSource } from './typeorm.config';

await postgresDataSource.runMigrations();
```

## Observações Importantes

1. **Compatibilidade**: O código existente continua funcionando sem alterações, usando Oracle como padrão.

2. **Entidades**: As entidades atuais estão configuradas para Oracle (tipos `varchar2`, etc.). Para usar PostgreSQL, você pode:
   - Criar entidades separadas para PostgreSQL
   - Usar decorators condicionais baseados em variáveis de ambiente
   - Criar adaptadores que traduzam entre os tipos

3. **Transações**: Cada conexão gerencia suas próprias transações. Não é possível fazer transações distribuídas entre Oracle e PostgreSQL usando apenas TypeORM.

4. **Performance**: Considere usar conexão pooling adequada para cada banco de dados conforme suas necessidades.

