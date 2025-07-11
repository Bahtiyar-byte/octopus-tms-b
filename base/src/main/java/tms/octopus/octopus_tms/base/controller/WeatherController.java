package tms.octopus.octopus_tms.base.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Tag(name = "Weather", description = "Weather API proxy to avoid CORS issues")
public class WeatherController {

    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${weather.api.key:b4b18010157af6350c104c59523e8307}")
    private String apiKey;
    
    @Value("${weather.api.base-url:https://api.openweathermap.org/data/2.5}")
    private String baseUrl;

    @GetMapping
    @Operation(summary = "Get weather data for coordinates")
    public ResponseEntity<?> getWeather(
            @RequestParam("lat") Double latitude,
            @RequestParam("lon") Double longitude,
            @RequestParam(value = "units", defaultValue = "imperial") String units) {
        
        try {
            String url = UriComponentsBuilder.fromUriString(baseUrl + "/weather")
                    .queryParam("lat", latitude)
                    .queryParam("lon", longitude)
                    .queryParam("appid", apiKey)
                    .queryParam("units", units)
                    .toUriString();
            
            log.debug("Fetching weather data from: {}", url);
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching weather data", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch weather data");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(503).body(errorResponse);
        }
    }
    
    @GetMapping("/forecast")
    @Operation(summary = "Get weather forecast for coordinates")
    public ResponseEntity<?> getWeatherForecast(
            @RequestParam("lat") Double latitude,
            @RequestParam("lon") Double longitude,
            @RequestParam(value = "units", defaultValue = "imperial") String units,
            @RequestParam(value = "cnt", defaultValue = "5") Integer count) {
        
        try {
            String url = UriComponentsBuilder.fromUriString(baseUrl + "/forecast")
                    .queryParam("lat", latitude)
                    .queryParam("lon", longitude)
                    .queryParam("appid", apiKey)
                    .queryParam("units", units)
                    .queryParam("cnt", count)
                    .toUriString();
            
            log.debug("Fetching weather forecast from: {}", url);
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching weather forecast", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch weather forecast");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(503).body(errorResponse);
        }
    }
}