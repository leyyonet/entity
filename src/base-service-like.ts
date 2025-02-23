import {BaseEntityLike} from "./base-entity-like";
import {BasePairLike} from "./base-pair-like";

type RE = Record<string, unknown>;
type X = unknown;
// noinspection JSUnusedGlobalSymbols
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
export interface BaseServiceLike<E extends BaseEntityLike<I, N>, I = string, N = string, P extends BasePairLike<I> = BasePairLike<I>, V = RE, C = RE, U = RE, R = X, F = X> {

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