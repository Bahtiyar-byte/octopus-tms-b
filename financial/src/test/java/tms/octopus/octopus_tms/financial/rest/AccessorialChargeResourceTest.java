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
import tms.octopus.octopus_tms.financial.accessorial_charge.repos.AccessorialChargeRepository;


@Sql({"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class AccessorialChargeResourceTest extends BaseIT {

    @Autowired
    public AccessorialChargeRepository accessorialChargeRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/accessorialChargeData.sql"})
    void getAllAccessorialCharges_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/accessorialCharges")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9b07759-46bc-3329-b35b-823b86eeb5f5"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/accessorialChargeData.sql"})
    void getAccessorialCharge_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/accessorialCharges/a9b07759-46bc-3329-b35b-823b86eeb5f5")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("description", Matchers.equalTo("Dictum fusce ut placerat orci nulla pellentesque dignissim enim."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getAccessorialCharge_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/accessorialCharges/23f75d91-4491-3970-9e5a-09f5a305e10c")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createAccessorialCharge_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/accessorialChargeDTORequest.json"))
                .when()
                    .post("/api/accessorialCharges")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, accessorialChargeRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createAccessorialCharge_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/accessorialChargeDTORequest_missingField.json"))
                .when()
                    .post("/api/accessorialCharges")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("chargeType"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/accessorialChargeData.sql"})
    void updateAccessorialCharge_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/accessorialChargeDTORequest.json"))
                .when()
                    .put("/api/accessorialCharges/a9b07759-46bc-3329-b35b-823b86eeb5f5")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Ullamcorper eget nulla facilisi etiam dignissim diam.", accessorialChargeRepository.findById(UUID.fromString("a9b07759-46bc-3329-b35b-823b86eeb5f5")).orElseThrow().getDescription());
        assertEquals(2, accessorialChargeRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/accessorialChargeData.sql"})
    void deleteAccessorialCharge_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/accessorialCharges/a9b07759-46bc-3329-b35b-823b86eeb5f5")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, accessorialChargeRepository.count());
    }

}
