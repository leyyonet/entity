import {BaseIdLike} from "./base-id-like";

/**
 * Base entity with system properties
 * */
export interface BaseEntityLike<I = string, N = string> extends BaseIdLike<I> {
    /**
     * Name of record, it can be string or I18n string {en:"Apple", de:"Apfel"}
     * */
    name?: N;
}