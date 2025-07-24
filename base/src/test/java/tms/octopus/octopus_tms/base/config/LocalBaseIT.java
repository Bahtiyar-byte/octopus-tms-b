package tms.octopus.octopus_tms.base.config;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.SqlMergeMode;
import org.springframework.util.StreamUtils;
import tms.octopus.octopus_tms.base.OctopusTmsApplication;

/**
 * Local integration test base class that uses local PostgreSQL instead of Testcontainers.
 * Requires local PostgreSQL database: octopus-tms-b-test
 */
@SpringBootTest(
        classes = OctopusTmsApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles("local-test")
@SqlMergeMode(SqlMergeMode.MergeMode.MERGE)
public abstract class LocalBaseIT {

    @LocalServerPort
    public int serverPort;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initRestAssured() {
        RestAssured.port = serverPort;
        RestAssured.urlEncodingEnabled = false;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    @BeforeEach
    public void beforeEach() {
        // Clean up database before each test
        cleanDatabase();
    }
    
    private void cleanDatabase() {
        // Disable foreign key checks
        jdbcTemplate.execute("SET session_replication_role = 'replica';");
        
        // Get all tables and truncate them
        jdbcTemplate.query(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'flyway%'",
            (rs, rowNum) -> rs.getString("tablename")
        ).forEach(table -> {
            jdbcTemplate.execute("TRUNCATE TABLE \"" + table + "\" CASCADE");
        });
        
        // Re-enable foreign key checks
        jdbcTemplate.execute("SET session_replication_role = 'origin';");
    }

    @SneakyThrows
    public String readResource(final String resourceName) {
        return StreamUtils.copyToString(getClass().getResourceAsStream(resourceName), StandardCharsets.UTF_8);
    }

    public String adminOctopusTMSSecurityConfigToken() {
        // user admin@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJhZG1pbkBpbnZhbGlkLmJvb3RpZnkuaW8iLCJyb2xlcyI6WyJBRE1JTiJdLCJpc3MiOiJib290aWZ5IiwiaWF0IjoxNzQ4NDc4ODUzLCJleHAiOjIyMDg5ODg4MDB9." +
                "Ztj8eYRSuNNMdV_9jcvKW5lF2Ors45PD8bz3cOhW3Teg9ZLv9yUzWq8xde4OLysvwzMO7ol7DvxD3UxOLxZtOw";
    }

    public String supervisorOctopusTMSSecurityConfigToken() {
        // user supervisor@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJzdXBlcnZpc29yQGludmFsaWQuYm9vdGlmeS5pbyIsInJvbGVzIjpbIlNVUEVSVklTT1IiXSwiaXNzIjoiYm9vdGlmeSIsImlhdCI6MTc0ODQ3ODg1MywiZXhwIjoyMjA4OTg4ODAwfQ." +
                "TTMlxKmgpTew8f1H8wQpQ7mq1n09kN12Lkd4tQ5IO544DdwwnQShcoHRDBzw240Hi64yDGGHYG3eNUuHb7C5HQ";
    }

    public String dispatcherOctopusTMSSecurityConfigToken() {
        // user dispatcher@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJkaXNwYXRjaGVyQGludmFsaWQuYm9vdGlmeS5pbyIsInJvbGVzIjpbIkRJU1BBVENIRVIiXSwiaXNzIjoiYm9vdGlmeSIsImlhdCI6MTc0ODQ3ODg1MywiZXhwIjoyMjA4OTg4ODAwfQ." +
                "5ByTAAipeOKAAYw5kqTsNa_VxpXX8n0EW7YP3HXjp2zirXmw6RzV9JHdOlADEKJgaBbErjn1Rb5BwAbsMnb3bw";
    }

    public String driverOctopusTMSSecurityConfigToken() {
        // user driver@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJkcml2ZXJAaW52YWxpZC5ib290aWZ5LmlvIiwicm9sZXMiOlsiRFJJVkVSIl0sImlzcyI6ImJvb3RpZnkiLCJpYXQiOjE3NDg0Nzg4NTMsImV4cCI6MjIwODk4ODgwMH0." +
                "r-s__o0f_3Pdbjz9aJ0o3RXWRHy7LwvY5EctsYgVX4QgN6pZ0g_phqN_K0mK6GoL_8jSXoEXs-HXfq4MBbu8ww";
    }

    public String accountingOctopusTMSSecurityConfigToken() {
        // user accounting@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJhY2NvdW50aW5nQGludmFsaWQuYm9vdGlmeS5pbyIsInJvbGVzIjpbIkFDQ09VTlRJTkciXSwiaXNzIjoiYm9vdGlmeSIsImlhdCI6MTc0ODQ3ODg1MywiZXhwIjoyMjA4OTg4ODAwfQ." +
                "ZFcrPQq6WqKZ4MI6453gj5WlmUnH5jC73F3F0mNLLgzNtCaqEGD9EluuwOiTXrYv_2h4qJMW8zzfwBS2nlq5mw";
    }

    public String salesOctopusTMSSecurityConfigToken() {
        // user sales@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJzYWxlc0BpbnZhbGlkLmJvb3RpZnkuaW8iLCJyb2xlcyI6WyJTQUxFUyJdLCJpc3MiOiJib290aWZ5IiwiaWF0IjoxNzQ4NDc4ODUzLCJleHAiOjIyMDg5ODg4MDB9." +
                "fkIiEZGZYTkQRByzOCDXiXOQq3AraJh6uC4S7jCN4EzfaZjIvpsHqYg7rM3bKoeGKbbHfkgo7NyCq59GhmAGmQ";
    }

    public String supportOctopusTMSSecurityConfigToken() {
        // user support@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJzdXBwb3J0QGludmFsaWQuYm9vdGlmeS5pbyIsInJvbGVzIjpbIlNVUFBPUlQiXSwiaXNzIjoiYm9vdGlmeSIsImlhdCI6MTc0ODQ3ODg1MywiZXhwIjoyMjA4OTg4ODAwfQ." +
                "IKjkISLbVTRf2fHM_PYIYL5B80XZz8xjuBkOWOtlrrznwHMd_dCOe7rI4afl7OFhMuIqzPUzdkVuYiKk_lV1sg";
    }
}