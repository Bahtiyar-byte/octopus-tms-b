# AI Agent Architecture Documentation

## Overview
The Octopus TMS AI Agent is an intelligent assistant integrated into the broker dashboard that helps users query and interact with their transportation management data using natural language. It combines database queries with AI-powered responses to provide contextual, helpful information.

## Architecture Components

### 1. Frontend Component (`AIAgent.tsx`)
Located at: `frontend/src/modules/broker/components/AIAgent.tsx`

**Features:**
- Text input with auto-resizing textarea
- Voice input support using Web Speech API
- Real-time processing indicators
- Formatted response display
- Suggestion buttons for follow-up actions

**Key Functions:**
- `handleSubmit()`: Sends query to backend API
- `handleVoiceInput()`: Manages speech recognition
- `formatDataDisplay()`: Formats data responses into user-friendly cards

### 2. Backend Services

#### AIAgentController.java
Located at: `src/main/java/com/octopus/tms/integration/ai/controller/AIAgentController.java`

**Endpoint:** `POST /api/ai/agent/query`

**Request Body:**
```json
{
  "query": "What's my revenue this month?",
  "context": "broker_dashboard"
}
```

**Response:**
```json
{
  "text": "Your total revenue this month is $45,890.00 from 23 invoices.",
  "data": {
    "revenue": {
      "total": 45890.00,
      "count": 23
    }
  },
  "suggestions": [
    "Generate invoice report",
    "View payment history",
    "Export financial data"
  ]
}
```

#### AIAgentService.java
Located at: `src/main/java/com/octopus/tms/integration/ai/service/AIAgentService.java`

**Core Methods:**
1. **`processQuery()`**: Main entry point that orchestrates the entire flow
2. **`analyzeQueryIntent()`**: Determines what the user is asking about
3. **`executeQueries()`**: Runs appropriate database queries
4. **`generateAIResponse()`**: Uses configured AI provider (Gemini/OpenAI/Claude)
5. **`generateFallbackResponse()`**: Creates human-friendly responses when AI fails

### 3. Database Integration

The AI Agent connects to your PostgreSQL database through Spring's `JdbcTemplate` to execute queries based on user intent.

#### Query Intent Types:
- **OPEN_LOADS**: Searches for available loads
- **CARRIER_SEARCH**: Finds carriers by equipment type
- **FINANCIAL**: Revenue and payment queries
- **LOAD_STATUS**: Load tracking information
- **CUSTOMER**: Customer-related queries
- **GENERAL**: Dashboard summaries

#### Example Database Queries:

**Open Loads Query:**
```sql
SELECT l.id, l.load_number, l.origin_city, l.origin_state, 
       l.destination_city, l.destination_state, l.equipment_type, l.rate 
FROM loads l 
WHERE l.status = 'POSTED' 
ORDER BY l.created_at DESC 
LIMIT 10
```

**Monthly Revenue Query:**
```sql
SELECT SUM(amount) as total, COUNT(*) as count 
FROM invoices 
WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
```

### 4. AI Provider Integration

The system uses the user's configured AI provider (set in Settings > AI Model Integration):

1. **Google Gemini** (`GoogleAIService.java`)
   - Model: gemini-1.5-flash
   - Endpoint: https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent

2. **OpenAI** (`OpenAIService.java`)
   - Model: gpt-3.5-turbo
   - Endpoint: https://api.openai.com/v1/chat/completions

3. **Anthropic Claude** (`AnthropicAIService.java`)
   - Model: claude-3-haiku-20240307
   - Endpoint: https://api.anthropic.com/v1/messages

## Data Flow

```
User Input → Frontend Component → Backend API
                                       ↓
                              Query Intent Analysis
                                       ↓
                              Database Queries
                                       ↓
                              AI Response Generation
                                       ↓
                              Fallback Response (if AI fails)
                                       ↓
                              Format Response + Suggestions
                                       ↓
                              Return to Frontend → Display to User
```

## Configuration

### 1. AI Provider Configuration
Users must configure at least one AI provider in Settings:
- Navigate to Settings → AI Model Integration
- Add API key for desired provider
- Test connection
- Set as active provider

### 2. Database Connection
Configured in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/octopus_tms
spring.datasource.username=postgres
spring.datasource.password=password
```

### 3. Docker Setup
The application uses Docker Compose for PostgreSQL:
```yaml
services:
  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: octopus_tms
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
```

## Customization Guide

### Adding New Query Types

1. **Add new QueryIntent enum value** in `AIAgentService.java`:
```java
private enum QueryIntent {
    OPEN_LOADS,
    CARRIER_SEARCH,
    FINANCIAL,
    EQUIPMENT_STATUS,  // New intent
    GENERAL
}
```

2. **Update intent analysis logic**:
```java
private QueryIntent analyzeQueryIntent(String query) {
    if (query.contains("equipment") && query.contains("status")) {
        return QueryIntent.EQUIPMENT_STATUS;
    }
    // ... existing logic
}
```

3. **Add database query execution**:
```java
case EQUIPMENT_STATUS:
    results.put("equipment", getEquipmentStatus());
    break;
```

4. **Create the query method**:
```java
private List<Map<String, Object>> getEquipmentStatus() {
    String sql = "SELECT e.id, e.type, e.status, e.location " +
                "FROM equipment e WHERE e.company_id = ? " +
                "ORDER BY e.last_updated DESC";
    return jdbcTemplate.queryForList(sql, getCurrentCompanyId());
}
```

5. **Update fallback responses**:
```java
if (data.containsKey("equipment")) {
    List<Map<String, Object>> equipment = (List<Map<String, Object>>) data.get("equipment");
    return String.format("I found %d pieces of equipment. Here's their current status.",
        equipment.size());
}
```

### Modifying Response Format

To change how data is displayed, update the `formatDataDisplay()` function in `AIAgent.tsx`:

```typescript
// Add new data type handling
if (data.equipment && Array.isArray(data.equipment)) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Equipment Status</h4>
      {data.equipment.map((item: any, index: number) => (
        <div key={index} className="bg-white p-3 rounded border border-gray-200">
          <p className="font-medium text-sm">{item.type}</p>
          <p className="text-xs text-gray-600">
            Status: {item.status} • Location: {item.location}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Improving AI Responses

1. **Enhance the prompt template** in `generateAIResponse()`:
```java
String prompt = String.format(
    "You are an AI assistant for a transportation management system. " +
    "The user asked: '%s'. Based on the following data, provide a helpful, " +
    "conversational response that includes specific numbers and actionable insights:\n\n%s\n\n" +
    "Guidelines:\n" +
    "- Be specific with numbers and percentages\n" +
    "- Suggest next steps the user can take\n" +
    "- Keep response under 3 sentences\n" +
    "- Use a friendly, professional tone",
    query, formatDataForPrompt(data)
);
```

2. **Add context-aware suggestions**:
```java
private List<String> generateSuggestions(QueryIntent intent, Map<String, Object> data) {
    List<String> suggestions = new ArrayList<>();
    
    // Add data-driven suggestions
    if (intent == QueryIntent.FINANCIAL && data.containsKey("revenue")) {
        Map<String, Object> revenue = (Map<String, Object>) data.get("revenue");
        if (revenue.get("total") != null && ((Number)revenue.get("total")).doubleValue() > 50000) {
            suggestions.add("View top performing customers");
            suggestions.add("Analyze profit margins");
        }
    }
    
    return suggestions;
}
```

## Error Handling

The system includes multiple layers of error handling:

1. **API Connection Errors**: Falls back to local response generation
2. **Database Errors**: Returns helpful error messages with suggestions
3. **No Data Found**: Provides context-specific empty state messages
4. **AI Provider Failures**: Uses intelligent fallback responses

## Security Considerations

1. **API Key Encryption**: All AI provider API keys are encrypted using AES encryption
2. **User Isolation**: Queries are scoped to the authenticated user's data
3. **SQL Injection Prevention**: Uses parameterized queries
4. **Rate Limiting**: Consider implementing rate limits for AI API calls

## Performance Optimization

1. **Database Indexing**: Ensure indexes on frequently queried columns:
   - loads.status
   - loads.created_at
   - invoices.created_at
   - carriers.equipment_types

2. **Caching**: Consider caching frequently accessed data
3. **Query Limits**: All queries include LIMIT clauses
4. **Async Processing**: For heavy queries, consider async processing

## Monitoring and Debugging

1. **Logging**: All queries and AI responses are logged
2. **Error Tracking**: Failed AI calls are logged with full context
3. **Query Performance**: Monitor slow queries in PostgreSQL
4. **API Usage**: Track AI provider API usage and costs

## Future Enhancements

1. **Multi-turn Conversations**: Maintain context between queries
2. **Advanced Analytics**: Integration with data visualization
3. **Proactive Insights**: AI-driven alerts and recommendations
4. **Voice Output**: Text-to-speech for responses
5. **Mobile Optimization**: Enhanced mobile experience
6. **Export Capabilities**: Direct export from AI responses