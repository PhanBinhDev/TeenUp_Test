import { Repository, SelectQueryBuilder } from 'typeorm';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

export class BaseService<T> {
  constructor(protected readonly repo: Repository<T>) {}

  async findWithPagination(
    qb: SelectQueryBuilder<T>,
    query: PaginationQuery,
  ): Promise<PaginationResult<T>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit),
      },
    };
  }
}
