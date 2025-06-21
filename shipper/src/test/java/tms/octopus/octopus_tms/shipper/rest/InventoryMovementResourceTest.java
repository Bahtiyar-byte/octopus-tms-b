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
import tms.octopus.octopus_tms.shipper.inventory_movement.repos.InventoryMovementRepository;


@Sql({"/data/clearAllShipper.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllShipper.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class InventoryMovementResourceTest extends BaseIT {

    @Autowired
    public InventoryMovementRepository inventoryMovementRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql", "/data/warehouseData.sql", "/data/inventoryMovementData.sql"})
    void getAllInventoryMovements_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryMovements")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9065cb5-6f55-3349-8522-c46a72f1dfb0"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql", "/data/warehouseData.sql", "/data/inventoryMovementData.sql"})
    void getInventoryMovement_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryMovements/a9065cb5-6f55-3349-8522-c46a72f1dfb0")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("itemId", Matchers.equalTo("a9a814aa-020a-3b32-8467-4a5887a35022"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getInventoryMovement_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryMovements/23ae450c-5536-306c-a66f-49f1c08321f2")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql", "/data/warehouseData.sql"})
    void createInventoryMovement_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryMovementDTORequest.json"))
                .when()
                    .post("/api/inventoryMovements")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, inventoryMovementRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createInventoryMovement_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryMovementDTORequest_missingField.json"))
                .when()
                    .post("/api/inventoryMovements")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("movementType"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql", "/data/warehouseData.sql", "/data/inventoryMovementData.sql"})
    void updateInventoryMovement_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryMovementDTORequest.json"))
                .when()
                    .put("/api/inventoryMovements/a9065cb5-6f55-3349-8522-c46a72f1dfb0")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4a814aa-020a-3b32-8467-4a5887a35022"), inventoryMovementRepository.findById(UUID.fromString("a9065cb5-6f55-3349-8522-c46a72f1dfb0")).orElseThrow().getItemId());
        assertEquals(2, inventoryMovementRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql", "/data/warehouseData.sql", "/data/inventoryMovementData.sql"})
    void deleteInventoryMovement_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/inventoryMovements/a9065cb5-6f55-3349-8522-c46a72f1dfb0")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, inventoryMovementRepository.count());
    }

}
