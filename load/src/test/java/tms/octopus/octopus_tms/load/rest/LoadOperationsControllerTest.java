package tms.octopus.octopus_tms.load.rest;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import tms.octopus.octopus_tms.base.config.BaseIT;


public class LoadOperationsControllerTest extends BaseIT {

    @Test
    void getLoadDetails_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/load-operations/test-loadId/details")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void acceptOffer_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .post("/load-operations/test-loadId/accept-offer/test-offerId")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void assignDriver_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/driverAssignmentDTORequest.json"))
                .when()
                    .post("/load-operations/test-loadId/assign-driver")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void assignDriver_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/driverAssignmentDTORequest_missingField.json"))
                .when()
                    .post("/load-operations/test-loadId/assign-driver")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("driverId"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    void updateLoadStatus_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStatusUpdateDTORequest.json"))
                .when()
                    .post("/load-operations/test-loadId/update-status")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void updateTracking_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadTrackingUpdateDTORequest.json"))
                .when()
                    .post("/load-operations/tracking/update")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void searchLoads_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadSearchCriteriaDTORequest.json"))
                .when()
                    .post("/load-operations/search")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void requestQuote_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadQuoteRequestDTORequest.json"))
                .when()
                    .post("/load-operations/quote-request")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
    }

}
