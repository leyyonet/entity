// noinspection JSUnusedGlobalSymbols
/**
 * Not replaceable properties in entity
 *
 * - It is used for create and update dto
 * - Corresponding properties will not be in create and update dto
 * - Even if client send them, service layer will exclude/ignore them
 *
 * @see {@link BaseEntityLike}
 * */
export type NotReplaceable = 'createdAt'|'createdBy'|'updatedAt'|'updatedBy';

// noinspection JSUnusedGlobalSymbols
/**
 * Not viewable properties in entity
 *
 * - It is used for view dto
 * - Corresponding properties will not be in response dto
 * - Even if entity has them, service layer will exclude/remove them
 *
 * @see {@link BaseEntityLike}
 * */
export type NotViewable = '$trash'|'$version'|'$search'|'$release'|'$irregulars';