import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function applySearch<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  fields: string[],
  search?: string,
)
 {
  if (!search) return qb;

  const term = `%${search.toLowerCase()}%`;

  fields.forEach((field, index) => {
    const clause =
      `LOWER(${alias}.${field}) LIKE :search`;

    if (index === 0) {
      qb.andWhere(clause, { search: term });
    } else {
      qb.orWhere(clause, { search: term });
    }
  });

  return qb;
}
