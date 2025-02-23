import {BaseIdLike} from "./base-id-like";
import {BaseEntityLike} from "./base-entity-like";

/**
 * Base entity with system properties
 * */
export interface BaseRichEntityLike<I = string, N = string> extends BaseEntityLike<I, N> {
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
     * Version of document, update count
     * */
    $version?: number;
    /**
     * Version of codebase which checked/validated this document
     *
     * It can be used development version of document
     * */
    $release?: number;
    /**
     * Custom properties which are defined in entity
     *
     * It can be used while checking custom defined properties in document
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