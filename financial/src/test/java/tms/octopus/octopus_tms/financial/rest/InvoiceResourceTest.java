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
import tms.octopus.octopus_tms.financial.invoice.repos.InvoiceRepository;


@Sql({"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllFinancial.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class InvoiceResourceTest extends BaseIT {

    @Autowired
    public InvoiceRepository invoiceRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql"})
    void getAllInvoices_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/invoices")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9a53013-58b9-3cbe-baa4-5b1ceea088c6"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql"})
    void getAllInvoices_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/invoices?filter=b8bdfd0d-fa22-33fc-a726-6376887f549b")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b8bdfd0d-fa22-33fc-a726-6376887f549b"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql"})
    void getInvoice_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/invoices/a9a53013-58b9-3cbe-baa4-5b1ceea088c6")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("invoiceNumber", Matchers.equalTo("Duis autem vel."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getInvoice_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/invoices/23e05616-c8ed-3594-a3f9-af00b142dd6f")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createInvoice_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/invoiceDTORequest.json"))
                .when()
                    .post("/api/invoices")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, invoiceRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createInvoice_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/invoiceDTORequest_missingField.json"))
                .when()
                    .post("/api/invoices")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("invoiceNumber"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql"})
    void updateInvoice_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/invoiceDTORequest.json"))
                .when()
                    .put("/api/invoices/a9a53013-58b9-3cbe-baa4-5b1ceea088c6")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Eget est lorem.", invoiceRepository.findById(UUID.fromString("a9a53013-58b9-3cbe-baa4-5b1ceea088c6")).orElseThrow().getInvoiceNumber());
        assertEquals(2, invoiceRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/invoiceData.sql"})
    void deleteInvoice_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/invoices/a9a53013-58b9-3cbe-baa4-5b1ceea088c6")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, invoiceRepository.count());
    }

}
