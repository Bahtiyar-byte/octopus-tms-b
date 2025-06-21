package tms.octopus.octopus_tms.core.rest;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import tms.octopus.octopus_tms.base.config.BaseIT;


public class AuthControllerTest extends BaseIT {

    @Test
    void login_success() {
        RestAssured
                .given()
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loginRequestDTORequest.json"))
                .when()
                    .post("/auth/login")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void login_missingField() {
        RestAssured
                .given()
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loginRequestDTORequest_missingField.json"))
                .when()
                    .post("/auth/login")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("username"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    void logout_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .post("/auth/logout")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    void refreshToken_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/refreshTokenRequestDTORequest.json"))
                .when()
                    .post("/auth/refresh")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void getCurrentUser_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/auth/me")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

}
