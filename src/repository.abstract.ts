import {
  Repository,
  SelectQueryBuilder,
  EntityTarget,
  EntityManager,
  SaveOptions,
  FindManyOptions,
  DeepPartial,
  FindOptionsWhere,
  DataSource,
} from 'typeorm';

export abstract class AbstractRepository<T> {
  private _entity: EntityTarget<T>;
  protected repository: Repository<T>;

  constructor(
    entity: EntityTarget<T>,
    private readonly _manager: EntityManager,
  ) {
    this._entity = entity;
    this.repository = this._manager.getRepository(this._entity);
  }

  async findById(id: number): Promise<T> {
    return await this.repository.findOneById(id);
  }

  async find(options?: FindManyOptions): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findAndCount(options?: FindManyOptions): Promise<[T[], number]> {
    return await this.repository.findAndCount(options);
  }

  async save(entity: T, options?: SaveOptions): Promise<T> {
    return this.repository.save(entity, options);
  }

  async saveMany(entities: T[], options?: SaveOptions): Promise<T[]> {
    return this.repository.save(entities, options);
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    return this.repository.create(entity);
  }

  async createMany(entities: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.create(entities);
  }

  async deleteById(id: number): Promise<T> {
    const entityFound = await this.repository.findOneBy({
      id,
    } as unknown as FindOptionsWhere<T>);

    if (!entityFound) throw new Error('Entity not found');
    return this.repository.remove(entityFound);
  }

  async update(id: number, data: DeepPartial<T>): Promise<T> {
    const entityFound = await this.repository.findOneBy({
      id,
    } as unknown as FindOptionsWhere<T>);

    if (!entityFound) throw new Error('Entity not found');

    const updatedEntity = await this.repository.merge(entityFound, data);
    return this.repository.save(updatedEntity);
  }

  async remove(entity: T): Promise<T> {
    return await this.repository.remove(entity);
  }

  getQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  async transaction(
    callback: (entityManager: EntityManager) => Promise<any>,
  ): Promise<any> {
    return await this._manager.transaction(
      async (transactionalEntityManager) => {
        return await callback(transactionalEntityManager);
      },
    );
  }
}
