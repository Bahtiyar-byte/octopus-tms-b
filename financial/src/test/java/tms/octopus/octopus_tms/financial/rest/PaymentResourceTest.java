package tms.octopus.octopus_tms.financial.rest;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.util.UUID;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;
import tms.octopus.octopus_tms.base.config.BaseIT;
import tms.octopus.octopus_tms.financial.payment.repos.PaymentRepository;


@Sql({"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class PaymentResourceTest extends BaseIT {

    @Autowired
    public PaymentRepository paymentRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/paymentData.sql"})
    void getAllPayments_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/payments")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9984c10-8157-3ea7-8c89-4b5cf34efc44"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/paymentData.sql"})
    void getAllPayments_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/payments?filter=b859da2b-a967-3b82-8766-939a658022c8")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b859da2b-a967-3b82-8766-939a658022c8"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/paymentData.sql"})
    void getPayment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/payments/a9984c10-8157-3ea7-8c89-4b5cf34efc44")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("companyId", Matchers.equalTo("a9ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getPayment_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/payments/2376c035-d5d0-32bd-aa0d-0834b93c9c26")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createPayment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/paymentDTORequest.json"))
                .when()
                    .post("/api/payments")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, paymentRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createPayment_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/paymentDTORequest_missingField.json"))
                .when()
                    .post("/api/payments")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("companyId"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/paymentData.sql"})
    void updatePayment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/paymentDTORequest.json"))
                .when()
                    .put("/api/payments/a9984c10-8157-3ea7-8c89-4b5cf34efc44")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"), paymentRepository.findById(UUID.fromString("a9984c10-8157-3ea7-8c89-4b5cf34efc44")).orElseThrow().getCompanyId());
        assertEquals(2, paymentRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/paymentData.sql"})
    void deletePayment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/payments/a9984c10-8157-3ea7-8c89-4b5cf34efc44")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, paymentRepository.count());
    }

}
