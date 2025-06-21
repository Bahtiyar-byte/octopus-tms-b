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
import tms.octopus.octopus_tms.financial.invoice_line_item.repos.InvoiceLineItemRepository;


@Sql({"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class InvoiceLineItemResourceTest extends BaseIT {

    @Autowired
    public InvoiceLineItemRepository invoiceLineItemRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql", "/data/invoiceLineItemData.sql"})
    void getAllInvoiceLineItems_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/invoiceLineItems")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9b991e5-d77a-3140-959f-fb95522992d0"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql", "/data/invoiceLineItemData.sql"})
    void getInvoiceLineItem_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/invoiceLineItems/a9b991e5-d77a-3140-959f-fb95522992d0")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("description", Matchers.equalTo("Xonsectetuer adipiscing."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getInvoiceLineItem_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/invoiceLineItems/2373001b-1d44-3492-9449-ce09d9f5d5ca")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql"})
    void createInvoiceLineItem_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/invoiceLineItemDTORequest.json"))
                .when()
                    .post("/api/invoiceLineItems")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, invoiceLineItemRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql", "/data/invoiceLineItemData.sql"})
    void updateInvoiceLineItem_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/invoiceLineItemDTORequest.json"))
                .when()
                    .put("/api/invoiceLineItems/a9b991e5-d77a-3140-959f-fb95522992d0")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Zed diam voluptua.", invoiceLineItemRepository.findById(UUID.fromString("a9b991e5-d77a-3140-959f-fb95522992d0")).orElseThrow().getDescription());
        assertEquals(2, invoiceLineItemRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql", "/data/invoiceLineItemData.sql"})
    void deleteInvoiceLineItem_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/invoiceLineItems/a9b991e5-d77a-3140-959f-fb95522992d0")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, invoiceLineItemRepository.count());
    }

}
