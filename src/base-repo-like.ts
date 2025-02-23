import {BaseEntityLike} from "./base-entity-like";
type X = unknown;
// noinspection JSUnusedGlobalSymbols
/**
 * Base service interface
 * Generics:
 * - I: Id type
 * - E: Entity
 * - N: Name type (string or i18n)
 * - R: Request
 * - F: Filter
 * */
export interface BaseRepo<E extends BaseEntityLike<I, N>, I = string, N = string, R = X, F = X> {

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