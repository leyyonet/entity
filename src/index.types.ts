// noinspection JSUnusedGlobalSymbols

export type ID = string | number;
export type DefId = string;
/**
 * Given id type
 * Generics:
 * - I: Id type
 * */
export type GivenId<I extends ID = DefId> = I|Partial<EntityIdLike<I>>;
/**
 * Given ids type
 * @see {@link GivenId}
 * */
export type GivenIds<I extends ID = DefId> = Array<GivenId<I>>;

export type NAME = string | Record<string, string>;
export type DefName = string;
export type XX = unknown;

/**
 * Simple entity interface
 * Generics:
 * - I: Id type
 * */
export interface EntityIdLike<I extends ID = DefId> extends Record<string, unknown> {
    /**
     * Identifier of entity
     * */
    id?: I;

    toJSON?(): unknown;
}

/**
 * Entity interface
 * Generics:
 * - I: Id type
 * - N: Name type
 * */
export interface EntityLike<I extends ID = DefId, N extends NAME = DefName> extends EntityIdLike<I> {
    /**
     * Name of record, it can be string or I18n string {en:"Apple", de:"Apfel"}
     * */
    name?: N;
}
/**
 * Pair interface
 * Generics:
 * - I: Id type
 * */
export interface PairLike<I extends ID = DefId> extends EntityIdLike<I> {
    /**
     * Name of entity, it should be string
     * If original name is I18n of entity, it should be transformed to plain way
     * */
    name?: string;
}
/**
 * Entity interface with system properties
 * Generics:
 * - I: Id type
 * - N: Name type
 * */
export interface RichEntityLike<I extends ID = DefId, N extends NAME = DefName> extends EntityLike<I, N> {
    /**
     * Creation time
     * */
    createdAt?: Date;
    /**
     * User id who created it
     * */
    createdBy?: unknown;
    /**
     * Last update time
     * */
    updatedAt?: Date;
    /**
     * User id who -last- updated it
     * */
    updatedBy?: unknown;
    /**
     * Version of entity, update count
     * */
    $version?: number;
    /**
     * Version of codebase which checked/validated this entity
     *
     * It can be used development version of entity
     * */
    $release?: number;
    /**
     * Custom properties which are defined in entity
     *
     * It can be used while checking custom defined properties in entity
     * */
    $irregulars?: Array<string>;
    /**
     * Trash id, it is null then it is not deleted
     * */
    $trash?: unknown;
    /**
     * Slugified search keywords
     * - as text => "foo bar"
     * - as array => ["foo", "bar"]
     * - as i18n array => {en:["apple"], de:["apfel"]}
     * */
    $search?: unknown;
}
/**
 * Repository interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - R: Request
 * - F: Filter
 * */
export interface RepositoryLike<I extends ID, E extends EntityLike<I>, R = XX, F = XX> {

    // region create
    /**
     * Creates/inserts an entity
     * */
    createOne?(req: R, doc: Partial<E>): Promise<E>;
    // endregion create

    // region update
    /**
     * Updates an entity
     * */
    updateById?(req: R, doc: Partial<E>): Promise<E>;
    /**
     * Updates an entity as partially
     * */
    setById?(req: R, doc: Partial<E>): Promise<E>;
    // endregion update

    // region get
    /**
     * Tries to find an entity with id
     * */
    findById?(req: R, id: I): Promise<E>;

    /**
     * Tries to find aen entity with slug
     * */
    findBySlug?(req: R, slug: string): Promise<E>;

    // endregion get


    // region list
    /**
     * Find entities with given ids
     * */
    findByIds?(req: R, ids: Array<I>): Promise<Array<E>>;
    /**
     * Find more records with given conditions
     *
     * It supports;
     * - where conditions
     * - order by
     * - limit offset
     * */
    findMore?(req: R, filter: F, options?: unknown): Promise<Array<E>>;
    // endregion list

    // region delete
    /**
     * Deletes -hard- an entity with id
     * */
    deleteById?(req: R, id: I): Promise<E>;
    /**
     * Deletes -hard- entities with ids
     *
     * */
    deleteByIds?(req: R, ids: Array<I>): Promise<number>;
    /**
     * Trashes an entity with id (soft delete)
     * */
    trashById?(req: R, id: I, trash?: unknown): Promise<E>;
    /**
     * Trashes entities with ids (soft delete)
     * */
    trashByIds?(req: R, ids: Array<I>, trash?: unknown): Promise<number>;
    // endregion delete
}
/**
 * Service interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - P: Pair
 * - V: View
 * - C: Create
 * - U: Update
 * - R: Request
 * - F: Filter
 * */
export type ServiceLike<I extends ID, E extends EntityLike<I>, P extends PairLike<I> = PairLike<I>, V = EntityLike<I>, C = EntityLike<I>, U = EntityLike<I>, R = XX, F = XX> =
    ServiceBase<I, E, P, V, C, U, R, F> &
    ServicePair<I, E, P, R> &
    ServiceView<I, E, V, R> &
    ServiceInternal<I, E, C, U, R, F>;

/**
 * Service base interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - P: Pair
 * - V: View
 * - C: Create
 * - U: Update
 * - R: Request
 * - F: Filter
 * */
interface ServiceBase<I extends ID, E extends EntityLike<I>, P extends PairLike<I>, V, C, U, R, F> {

    /**
     * It returns view object to hide original entity
     *
     * @see {@link $createOne}
     * */
    createOne?(req: R, dto: C): Promise<V>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $prepareById}
     * */
    prepareById?(req: R, id?: I): Promise<V>;

    /**
     * It returns view object to hide original entity
     *
     * @see {@link $updateById}
     * */
    updateById?(req: R, id: I, dto: U): Promise<V>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $setById}
     * */
    setById?(req: R, id: I, dto: Partial<U>|Partial<E>): Promise<V>;

    /**
     * It returns view object to hide original entity
     *
     * @see {@link $findById}
     * */
    findById?(req: R, id: I): Promise<V>;

    /**
     * It returns view object to hide original entity
     *
     * @see {@link $findBySlug}
     * */
    findBySlug?(req: R, slug: string): Promise<V>;

    /**
     * Find more records with given conditions
     *
     * It supports;
     * - where conditions
     * - order by
     * - limit offset
     * */
    findByIds?(req: R, ids: Array<I>): Promise<Array<V>>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $findMore}
     * */
    findMore?(req: R, filter: F, options?: unknown): Promise<Array<V>>;

    /**
     * It returns view object to hide original entity
     *
     * @see {@link $deleteById}
     * */
    deleteById?(req: R, id: I): Promise<P>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $deleteByIds}
     * */
    deleteByIds?(req: R, ids: Array<I>): Promise<number>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $trashById}
     * */
    trashById?(req: R, id: I, trash?: unknown): Promise<P>;
    /**
     * It returns view objects to hide original entity
     *
     * @see {@link $trashByIds}
     * */
    trashByIds?(req: R, ids: Array<I>, trash?: unknown): Promise<P>;
}

/**
 * Service pair interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - P: Pair
 * - R: Request
 * */
interface ServicePair<I extends ID, E extends EntityLike<I>, P extends PairLike<I>, R> {
    /**
     * Convert an entity to pair
     * */
    toPair?(req: R, doc: E, variant?: string): Promise<P>;
    /**
     * Convert entities to pairs
     * */
    toPairs?(req: R, docs: Array<E>, variant?: string): Promise<Array<P>>;
    /**
     * Convert a pair to an entity
     * */
    fromPair?(req: R, pair: P): Promise<E>;
    /**
     * Convert pairs to entites
     * */
    fromPairs?(req: R, pairs: Array<P>): Promise<Array<E>>;

    /**
     * Returns pair for an entity with given id
     * @sample {id: 1, name: "Apple"}
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    pairById?(req: R, id: I): Promise<P>;

    /**
     * Return pair list for entities with given id list
     * @sample [{id: 1, name: "Apple"}, {id: 2, name: "Plum"}, ...]
     * */
    pairsByIds?(req: R, ids: Array<I>): Promise<Array<P>>;

    /**
     * List pair list with given query
     * It can be used to fill combo, auto suggest etc
     * */
    pairsMore?(req: R, query?: string|unknown, limit?: number): Promise<Array<P>>;
}

/**
 * Service view interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - V: View
 * - R: Request
 * */
interface ServiceView<I extends ID, E extends EntityLike<I>, V, R> {
    /**
     * Convert an entity to a view
     * */
    toView?(req: R, doc: E, variant?: string): Promise<V>;
    /**
     * Convert entities to views
     * */
    toViews?(req: R, docs: Array<E>, variant?: string): Promise<Array<V>>;
    /**
     * Convert a view to an entity
     * */
    fromView?(req: R, view: V): Promise<E>;
    /**
     * Convert views to entities
     * */
    fromViews?(req: R, views: Array<V>): Promise<Array<E>>;
}

/**
 * Service internal interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - C: Create
 * - U: Update
 * - R: Request
 * - F: Filter
 * */
interface ServiceInternal<I extends ID, E extends EntityLike<I>, C, U, R, F> {

    /**
     * Creates/inserts an entity
     * - It does not allow omitted properties
     * - If existingId is provided then new id will not be generated, and existingId will be used for id
     * */
    $createOne?(req: R, dto: C, existingId?: GivenId<I>): Promise<E>;
    /**
     * Prepares for insert
     * - If id is null then it collects sample data before insert
     * - If id is valid then it fetches original record, clear some sensitive data
     *
     * - If record does not exist then it raises not-found exception (if id is provided)
     * @throws RecordNotFoundException
     * */
    $prepareById?(req: R, id: GivenId<I>): Promise<E>;
    /**
     * Updates an entity
     * - It does not allow omitted properties
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     *
     * */
    $updateById?(req: R, id: GivenId<I>, dto: U|Partial<E>): Promise<E>;
    /**
     * Updates an entity as partially
     * - It does not allow omitted properties
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     *
     * */
    $setById?(req: R, id: GivenId<I>, dto: Partial<U>|Partial<E>): Promise<E>;
    /**
     * Tries to find a record with id
     * - It validates and transforms id even if it is pair formatted {id, name, ...}
     *
     * When record is not found
     * - If throwing then raises an exception
     * - else returns undefined
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    $lookById?(req: R, id: GivenId<I>, throwing?: boolean): Promise<E>;
    /**
     * Tries to find a record with id
     *
     * When record is not found
     * - If throwing then raises an exception
     * - else returns undefined
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    $findById?(req: R, id: GivenId<I>): Promise<E>;
    /**
     * Tries to find a record with slug
     * - It validates and transforms id even if it is pair formatted {id, name, ...}
     *
     * When record is not found
     * - If throwing then raises an exception
     * - else returns undefined
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    $lookBySlug?(req: R, slug: string|Partial<E>, throwing?: boolean): Promise<E>;
    /**
     * Tries to find a record with slug
     *
     * When record is not found
     * - If throwing then raises an exception
     * - else returns undefined
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    $findBySlug?(req: R, slug: string|Partial<E>): Promise<E>;
    /**
     * Find more records with given conditions
     *
     * It supports;
     * - where conditions
     * - order by
     * - limit offset
     * */
    $findByIds?(req: R, ids: GivenIds<I>): Promise<Array<E>>;
    /**
     * Find more records with given conditions
     *
     * It supports;
     * - where conditions
     * - order by
     * - limit offset
     * */
    $findMore?(req: R, filter: F, options?: unknown): Promise<Array<E>>;
    /**
     * Deletes -hard- an entity with id
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    $deleteById?(req: R, id: GivenId<I>): Promise<E>;
    /**
     * Deletes -hard- entities with ids
     *
     * */
    $deleteByIds?(req: R, ids: GivenIds<I>): Promise<number>;
    /**
     * Trashes an entity with id (soft delete)
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    $trashById?(req: R, id: GivenId<I>, trash?: unknown): Promise<E>;
    /**
     * Trashes entities with ids (soft delete)
     * */
    $trashByIds?(req: R, ids: GivenIds<I>, trash?: unknown): Promise<number>;
}