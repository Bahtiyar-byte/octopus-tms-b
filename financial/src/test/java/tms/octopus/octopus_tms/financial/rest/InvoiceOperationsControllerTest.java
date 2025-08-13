package tms.octopus.octopus_tms.financial.rest;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import tms.octopus.octopus_tms.base.config.BaseIT;


public class InvoiceOperationsControllerTest extends BaseIT {

    @Test
    void getInvoiceDetails_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/invoice-operations/test-invoiceId/details")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void sendInvoice_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/invoiceSendRequestDTORequest.json"))
                .when()
                    .post("/invoice-operations/test-invoiceId/send")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void sendInvoice_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/invoiceSendRequestDTORequest_missingField.json"))
                .when()
                    .post("/invoice-operations/test-invoiceId/send")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("recipientEmail"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    void recordPayment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/paymentRecordDTORequest.json"))
                .when()
                    .post("/invoice-operations/test-invoiceId/payment")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
    }

}
