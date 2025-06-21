package tms.octopus.octopus_tms.base.user.model;

import lombok.experimental.FieldNameConstants;


@FieldNameConstants(onlyExplicitlyIncluded = true)
public enum UserRole {

    @FieldNameConstants.Include
    ADMIN,
    @FieldNameConstants.Include
    SUPERVISOR,
    @FieldNameConstants.Include
    DISPATCHER,
    @FieldNameConstants.Include
    DRIVER,
    @FieldNameConstants.Include
    ACCOUNTING,
    @FieldNameConstants.Include
    SALES,
    @FieldNameConstants.Include
    SUPPORT

}
