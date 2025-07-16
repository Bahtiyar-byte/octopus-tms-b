package tms.octopus.octopus_tms.shipper.rest;

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
import tms.octopus.octopus_tms.shipper.inventory_level.repos.InventoryLevelRepository;


@Sql({"/data/clearAllShipper.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllShipper.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class InventoryLevelResourceTest extends BaseIT {

    @Autowired
    public InventoryLevelRepository inventoryLevelRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql", "/data/inventoryLevelData.sql"})
    void getAllInventoryLevels_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryLevels")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a945de21-a1bb-3714-a0bc-8a897ed32e9f"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql", "/data/inventoryLevelData.sql"})
    void getInventoryLevel_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryLevels/a945de21-a1bb-3714-a0bc-8a897ed32e9f")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("itemId", Matchers.equalTo("a9a814aa-020a-3b32-8467-4a5887a35022"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getInventoryLevel_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryLevels/239883fc-a95d-3e5e-87ee-6c94c6c32028")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql"})
    void createInventoryLevel_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryLevelDTORequest.json"))
                .when()
                    .post("/api/inventoryLevels")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, inventoryLevelRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createInventoryLevel_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryLevelDTORequest_missingField.json"))
                .when()
                    .post("/api/inventoryLevels")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("quantity"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql", "/data/inventoryLevelData.sql"})
    void updateInventoryLevel_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryLevelDTORequest.json"))
                .when()
                    .put("/api/inventoryLevels/a945de21-a1bb-3714-a0bc-8a897ed32e9f")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4a814aa-020a-3b32-8467-4a5887a35022"), inventoryLevelRepository.findById(UUID.fromString("a945de21-a1bb-3714-a0bc-8a897ed32e9f")).orElseThrow());
        assertEquals(2, inventoryLevelRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql", "/data/inventoryLevelData.sql"})
    void deleteInventoryLevel_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/inventoryLevels/a945de21-a1bb-3714-a0bc-8a897ed32e9f")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, inventoryLevelRepository.count());
    }

}
