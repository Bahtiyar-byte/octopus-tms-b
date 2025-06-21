package tms.octopus.octopus_tms.shipper.rest;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import tms.octopus.octopus_tms.base.config.BaseIT;


public class WarehouseOperationsControllerTest extends BaseIT {

    @Test
    void getInventorySummary_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/warehouse-operations/test-warehouseId/inventory-summary")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void confirmShipmentReady_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/shipmentConfirmationDTORequest.json"))
                .when()
                    .post("/warehouse-operations/shipment-ready/test-readinessId/confirm")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void confirmShipmentReady_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/shipmentConfirmationDTORequest_missingField.json"))
                .when()
                    .post("/warehouse-operations/shipment-ready/test-readinessId/confirm")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("confirmedBy"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

}
