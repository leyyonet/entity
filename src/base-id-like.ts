/**
 * Base entity with only id property
 * */
export interface BaseIdLike<I = string> extends Record<string, any> {
    /**
     * Identifier of document
     * */
    id?: I;

    toJSON?(): unknown;
}