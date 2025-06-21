package tms.octopus.octopus_tms.load.rest;

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
import tms.octopus.octopus_tms.load.load_cargo.repos.LoadCargoRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadCargoResourceTest extends BaseIT {

    @Autowired
    public LoadCargoRepository loadCargoRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadCargoData.sql"})
    void getAllLoadCargos_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadCargos")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9e00f2f-4bfc-3b75-85cb-641066f2859b"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadCargoData.sql"})
    void getLoadCargo_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadCargos/a9e00f2f-4bfc-3b75-85cb-641066f2859b")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("commodity", Matchers.equalTo("Ut wisi enim."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoadCargo_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadCargos/23b1fb02-964a-364e-a57f-9f26a31f72cf")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void createLoadCargo_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadCargoDTORequest.json"))
                .when()
                    .post("/api/loadCargos")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadCargoRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoadCargo_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadCargoDTORequest_missingField.json"))
                .when()
                    .post("/api/loadCargos")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("commodity"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadCargoData.sql"})
    void updateLoadCargo_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadCargoDTORequest.json"))
                .when()
                    .put("/api/loadCargos/a9e00f2f-4bfc-3b75-85cb-641066f2859b")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Viverra suspendisse.", loadCargoRepository.findById(UUID.fromString("a9e00f2f-4bfc-3b75-85cb-641066f2859b")).orElseThrow().getCommodity());
        assertEquals(2, loadCargoRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadCargoData.sql"})
    void deleteLoadCargo_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loadCargos/a9e00f2f-4bfc-3b75-85cb-641066f2859b")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadCargoRepository.count());
    }

}
