package tms.octopus.octopus_tms.base.user.model;

import lombok.experimental.FieldNameConstants;


@FieldNameConstants(onlyExplicitlyIncluded = true)
public enum UserRole {

    @FieldNameConstants.Include
    ADMIN,

    @FieldNameConstants.Include
    SALES_REP,
}
