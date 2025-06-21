package tms.octopus.octopus_tms.core.rest;

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
import tms.octopus.octopus_tms.core.company.repos.CompanyRepository;


@Sql("/data/clearAllCore.sql")
public class CompanyResourceTest extends BaseIT {

    @Autowired
    public CompanyRepository companyRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/companyData.sql"})
    void getAllCompanies_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/companies")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9b7ba70-783b-317e-9998-dc4dd82eb3c5"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/companyData.sql"})
    void getAllCompanies_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/companies?filter=b8c37e33-defd-351c-b91e-1e03e51657da")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b8c37e33-defd-351c-b91e-1e03e51657da"));
    }

    @Test
    void getAllCompanies_unauthorized() {
        RestAssured
                .given()
                    .redirects().follow(false)
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/companies")
                .then()
                    .statusCode(HttpStatus.UNAUTHORIZED.value())
                    .body("code", Matchers.equalTo("AUTHORIZATION_DENIED"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/companyData.sql"})
    void getCompany_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/companies/a9b7ba70-783b-317e-9998-dc4dd82eb3c5")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("name", Matchers.equalTo("Zed diam voluptua."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getCompany_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/companies/23d7c8a0-8b4a-3a1b-87c5-99473f5dddda")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createCompany_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/companyDTORequest.json"))
                .when()
                    .post("/api/companies")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, companyRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createCompany_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/companyDTORequest_missingField.json"))
                .when()
                    .post("/api/companies")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("name"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/companyData.sql"})
    void updateCompany_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/companyDTORequest.json"))
                .when()
                    .put("/api/companies/a9b7ba70-783b-317e-9998-dc4dd82eb3c5")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Duis autem vel.", companyRepository.findById(UUID.fromString("a9b7ba70-783b-317e-9998-dc4dd82eb3c5")).orElseThrow().getName());
        assertEquals(2, companyRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/companyData.sql"})
    void deleteCompany_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/companies/a9b7ba70-783b-317e-9998-dc4dd82eb3c5")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, companyRepository.count());
    }

}
