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
import tms.octopus.octopus_tms.load.load_document.repos.LoadDocumentRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadDocumentResourceTest extends BaseIT {

    @Autowired
    public LoadDocumentRepository loadDocumentRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadDocumentData.sql"})
    void getAllLoadDocuments_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadDocuments")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9cf8717-4deb-3ccd-a89c-90c34577b82f"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadDocumentData.sql"})
    void getAllLoadDocuments_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadDocuments?filter=b89ef477-884b-3ac2-a41b-19ee4fb776ae")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(1))
                    .body("get(0).id", Matchers.equalTo("b89ef477-884b-3ac2-a41b-19ee4fb776ae"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadDocumentData.sql"})
    void getLoadDocument_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadDocuments/a9cf8717-4deb-3ccd-a89c-90c34577b82f")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("stopId", Matchers.equalTo("a93e9517-f8ec-361b-bb4f-6e084a84284e"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoadDocument_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadDocuments/23ab1a52-f058-358b-947c-df8261b5e1a2")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void createLoadDocument_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadDocumentDTORequest.json"))
                .when()
                    .post("/api/loadDocuments")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadDocumentRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoadDocument_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadDocumentDTORequest_missingField.json"))
                .when()
                    .post("/api/loadDocuments")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("documentType"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadDocumentData.sql"})
    void updateLoadDocument_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadDocumentDTORequest.json"))
                .when()
                    .put("/api/loadDocuments/a9cf8717-4deb-3ccd-a89c-90c34577b82f")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f43e9517-f8ec-361b-bb4f-6e084a84284e"), loadDocumentRepository.findById(UUID.fromString("a9cf8717-4deb-3ccd-a89c-90c34577b82f")).orElseThrow().getStopId());
        assertEquals(2, loadDocumentRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadDocumentData.sql"})
    void deleteLoadDocument_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loadDocuments/a9cf8717-4deb-3ccd-a89c-90c34577b82f")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadDocumentRepository.count());
    }

}
