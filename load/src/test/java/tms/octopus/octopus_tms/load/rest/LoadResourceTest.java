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
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadResourceTest extends BaseIT {

    @Autowired
    public LoadRepository loadRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void getAllLoads_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loads")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a93e29a3-5278-371c-bf65-495871231324"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void getAllLoads_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loads?filter=b8f45244-f093-39e1-aea3-f9117ca45157")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b8f45244-f093-39e1-aea3-f9117ca45157"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void getLoad_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loads/a93e29a3-5278-371c-bf65-495871231324")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("loadNumber", Matchers.equalTo("Consetetur sadipscing."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoad_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loads/2383af9d-6f6c-36ac-ae72-992f2977f67e")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoad_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadDTORequest.json"))
                .when()
                    .post("/api/loads")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoad_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadDTORequest_missingField.json"))
                .when()
                    .post("/api/loads")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("loadNumber"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void updateLoad_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadDTORequest.json"))
                .when()
                    .put("/api/loads/a93e29a3-5278-371c-bf65-495871231324")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Sed ut perspiciatis.", loadRepository.findById(UUID.fromString("a93e29a3-5278-371c-bf65-495871231324")).orElseThrow().getLoadNumber());
        assertEquals(2, loadRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void deleteLoad_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loads/a93e29a3-5278-371c-bf65-495871231324")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadRepository.count());
    }

}
