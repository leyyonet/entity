// noinspection JSUnusedGlobalSymbols

export type IdBase = string | number;
export type DefId = string;
export type XX = unknown;

/**
 * Base entity with only id property
 * */
export interface BaseId<I extends IdBase = DefId> extends Record<string, unknown> {
    /**
     * Identifier of entity
     * */
    id?: I;

    toJSON?(): unknown;
}

/**
 * Base entity with system properties
 * */
export interface BaseEntity<I extends IdBase = DefId, N = string> extends BaseId<I> {
    /**
     * Name of record, it can be string or I18n string {en:"Apple", de:"Apfel"}
     * */
    name?: N;
}
/**
 * Base pair as id and name properties
 * */
export interface BasePair<I extends IdBase = DefId> extends BaseId<I> {
    /**
     * Name of entity, it should be string
     * If original name is I18n of entity, it should be transformed to plain way
     * */
    name?: string;
}
/**
 * Base entity with system properties
 * */
export interface BaseRichEntity<I extends IdBase = DefId, N = string> extends BaseEntity<I, N> {
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
 * Base service interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - N: Name type (string or i18n)
 * - R: Request
 * - F: Filter
 * */
export interface BaseRepo<I extends IdBase, N, E extends BaseEntity<I, N>, R = XX, F = XX> {

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
    findBySlug?(req: R, slug: I): Promise<E>;

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
 * Base service interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - N: Name type (string or i18n)
 * - P: Pair
 * - V: View
 * - C: Create
 * - U: Update
 * - R: Request
 * - F: Filter
 * */
export interface BaseService<I extends IdBase, N, E extends BaseEntity<I, N>, P extends BasePair<I> = BasePair<I>, V = BaseEntity<I, N>, C = BaseEntity<I, N>, U = BaseEntity<I, N>, R = XX, F = XX> {

    // region create
    /**
     * Creates/inserts an entity
     * - It does not allow omitted properties
     * - If existingId is provided then new id will not be generated, and existingId will be used for id
     * */
    $createOne?(req: R, dto: C, existingId?: I|Partial<P>|Partial<E>): Promise<E>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $createOne}
     * */
    createOne?(req: R, dto: C): Promise<V>;

    /**
     * Prepares for insert
     * - If id is null then it collects sample data before insert
     * - If id is valid then it fetches original record, clear some sensitive data
     *
     * - If record does not exist then it raises not-found exception (if id is provided)
     * @throws RecordNotFoundException
     * */
    $prepareById?(req: R, id: I|Partial<P>|Partial<E>): Promise<E>;

    /**
     * It returns view object to hide original entity
     *
     * @see {@link $prepareById}
     * */
    prepareById?(req: R, id?: I): Promise<V>;
    // endregion create

    // region update
    /**
     * Updates an entity
     * - It does not allow omitted properties
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     *
     * */
    $updateById?(req: R, id: I|Partial<P>|Partial<E>, dto: U|Partial<E>): Promise<E>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $updateById}
     * */
    updateById?(req: R, id: I, dto: U): Promise<V>;
    /**
     * Updates an entity as partially
     * - It does not allow omitted properties
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     *
     * */
    $setById?(req: R, id: I|Partial<P>|Partial<E>, dto: Partial<U>|Partial<E>): Promise<E>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $setById}
     * */
    setById?(req: R, id: I, dto: Partial<U>|Partial<E>): Promise<V>;
    // endregion update

    // region get
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
    $lookById?(req: R, id: I|Partial<P>|Partial<E>, throwing?: boolean): Promise<E>;
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
    $findById?(req: R, id: I|Partial<P>|Partial<E>): Promise<E>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $findById}
     * */
    findById?(req: R, id: I): Promise<V>;


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
    $findBySlug?(req: R, slug: I|Partial<P>|Partial<E>): Promise<E>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $findBySlug}
     * */
    findBySlug?(req: R, slug: string): Promise<V>;

    // endregion get


    // region list
    /**
     * Find more records with given conditions
     *
     * It supports;
     * - where conditions
     * - order by
     * - limit offset
     * */
    $findByIds?(req: R, ids: Array<I|Partial<P>|Partial<E>>): Promise<Array<E>>;
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
     * Find more records with given conditions
     *
     * It supports;
     * - where conditions
     * - order by
     * - limit offset
     * */
    $findMore?(req: R, filter: F, options?: unknown): Promise<Array<E>>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $findMore}
     * */
    findMore?(req: R, filter: F, options?: unknown): Promise<Array<V>>;
    // endregion list

    // region delete
    /**
     * Deletes -hard- an entity with id
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    $deleteById?(req: R, id: I|Partial<P>|Partial<E>): Promise<E>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $deleteById}
     * */
    deleteById(req: R, id: I): Promise<P>;
    /**
     * Deletes -hard- entities with ids
     *
     * */
    $deleteByIds?(req: R, ids: Array<I|Partial<P>|Partial<E>>): Promise<number>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $deleteByIds}
     * */
    deleteByIds?(req: R, ids: Array<I>): Promise<number>;
    /**
     * Trashes an entity with id (soft delete)
     *
     * - If record does not exist then it raises not-found exception
     * @throws RecordNotFoundException
     * */
    $trashById?(req: R, id: I|Partial<P>|Partial<E>, trash?: unknown): Promise<E>;
    /**
     * It returns view object to hide original entity
     *
     * @see {@link $trashById}
     * */
    trashById?(req: R, id: I, trash?: unknown): Promise<P>;

    /**
     * Trashes entities with ids (soft delete)
     * */
    $trashByIds?(req: R, ids: Array<I|Partial<P>|Partial<E>>, trash?: unknown): Promise<number>;
    /**
     * It returns view objects to hide original entity
     *
     * @see {@link $trashByIds}
     * */
    trashByIds?(req: R, ids: Array<I>, trash?: unknown): Promise<P>;

    // endregion delete

    // region pair
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
    pairsMore(req: R, query?: string|unknown, limit?: number): Promise<Array<P>>;
    // endregion pair

    // region view
    /**
     * Convert an entity to a view
     * */
    toView?(req: R, doc: E, variant?: string): Promise<V>;
    /**
     * Convert entities to views
     * */
    toViews?(req: R, docs: Array<E>, variant?: string): Promise<Array<V>>;
    // endregion view
}