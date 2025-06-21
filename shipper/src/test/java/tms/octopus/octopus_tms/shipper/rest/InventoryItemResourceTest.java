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
import tms.octopus.octopus_tms.shipper.inventory_item.repos.InventoryItemRepository;


@Sql({"/data/clearAllShipper.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllShipper.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class InventoryItemResourceTest extends BaseIT {

    @Autowired
    public InventoryItemRepository inventoryItemRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql"})
    void getAllInventoryItems_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryItems")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9bfd6e8-f26d-3d35-b7f4-c5038264ef36"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql"})
    void getAllInventoryItems_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryItems?filter=b817bb4e-7fa0-341e-8f5e-04fea764ab91")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b817bb4e-7fa0-341e-8f5e-04fea764ab91"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql"})
    void getInventoryItem_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryItems/a9bfd6e8-f26d-3d35-b7f4-c5038264ef36")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("companyId", Matchers.equalTo("a9ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getInventoryItem_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/inventoryItems/23d762ca-733a-3392-a641-5450b0dbf9d2")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createInventoryItem_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryItemDTORequest.json"))
                .when()
                    .post("/api/inventoryItems")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, inventoryItemRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createInventoryItem_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryItemDTORequest_missingField.json"))
                .when()
                    .post("/api/inventoryItems")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("sku"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql"})
    void updateInventoryItem_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/inventoryItemDTORequest.json"))
                .when()
                    .put("/api/inventoryItems/a9bfd6e8-f26d-3d35-b7f4-c5038264ef36")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"), inventoryItemRepository.findById(UUID.fromString("a9bfd6e8-f26d-3d35-b7f4-c5038264ef36")).orElseThrow().getCompanyId());
        assertEquals(2, inventoryItemRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/inventoryItemData.sql"})
    void deleteInventoryItem_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/inventoryItems/a9bfd6e8-f26d-3d35-b7f4-c5038264ef36")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, inventoryItemRepository.count());
    }

}
