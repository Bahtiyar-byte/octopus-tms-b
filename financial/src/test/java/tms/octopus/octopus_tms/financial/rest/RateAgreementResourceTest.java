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
import tms.octopus.octopus_tms.financial.rate_agreement.repos.RateAgreementRepository;


@Sql({"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class RateAgreementResourceTest extends BaseIT {

    @Autowired
    public RateAgreementRepository rateAgreementRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/rateAgreementData.sql"})
    void getAllRateAgreements_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/rateAgreements")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9c170ec-bb8f-31af-b2c6-de48ea5343e7"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/rateAgreementData.sql"})
    void getAllRateAgreements_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/rateAgreements?filter=b8788c8c-64fd-35c4-b0e2-3e7534c3ebc8")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b8788c8c-64fd-35c4-b0e2-3e7534c3ebc8"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/rateAgreementData.sql"})
    void getRateAgreement_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/rateAgreements/a9c170ec-bb8f-31af-b2c6-de48ea5343e7")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("agreementNumber", Matchers.equalTo("Eget est lorem."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getRateAgreement_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/rateAgreements/236555cf-42a6-3197-82a9-52aa33cfa2cb")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createRateAgreement_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/rateAgreementDTORequest.json"))
                .when()
                    .post("/api/rateAgreements")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, rateAgreementRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createRateAgreement_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/rateAgreementDTORequest_missingField.json"))
                .when()
                    .post("/api/rateAgreements")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("agreementNumber"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/rateAgreementData.sql"})
    void updateRateAgreement_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/rateAgreementDTORequest.json"))
                .when()
                    .put("/api/rateAgreements/a9c170ec-bb8f-31af-b2c6-de48ea5343e7")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Xonsectetuer adipiscing.", rateAgreementRepository.findById(UUID.fromString("a9c170ec-bb8f-31af-b2c6-de48ea5343e7")).orElseThrow().getAgreementNumber());
        assertEquals(2, rateAgreementRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/rateAgreementData.sql"})
    void deleteRateAgreement_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/rateAgreements/a9c170ec-bb8f-31af-b2c6-de48ea5343e7")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, rateAgreementRepository.count());
    }

}
