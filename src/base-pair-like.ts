import {BaseIdLike} from "./base-id-like";

/**
 * Base pair as id and name properties
 * */
export interface BasePairLike<I = string> extends BaseIdLike<I> {
    /**
     * Name of document, it should be string
     * If original name is I18n of document, it should be transformed to plain way
     * */
    name?: string;
}