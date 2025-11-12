================
CODE SNIPPETS
================
TITLE: Search API
DESCRIPTION: Perform a search query using the Perplexity AI API. You can specify the query, and optionally the maximum number of results.

SOURCE: https://docs.perplexity.ai/guides/search-quickstart

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
This endpoint allows you to perform a search query and retrieve relevant results. You can control the number of results returned.

### Method
POST

### Endpoint
`/search`

### Parameters
#### Query Parameters
- `query` (string) - Required - The search query string.
- `max_results` (integer) - Optional - The maximum number of results to return. Accepts values from 1 to 20. Defaults to 10.

### Request Example
```json
{
  "query": "latest advancements in renewable energy technology",
  "max_results": 5
}
```

### Response
#### Success Response (200)
- `results` (array) - An array of search result objects.
  - `title` (string) - The title of the search result.
  - `url` (string) - The URL of the search result.
  - `snippet` (string) - A brief snippet or summary of the search result.

#### Response Example
```json
{
  "results": [
    {
      "title": "Advancements in Solar Panel Efficiency",
      "url": "https://example.com/solar-advancements",
      "snippet": "A review of the latest breakthroughs in photovoltaic technology..."
    },
    {
      "title": "New Wind Turbine Designs",
      "url": "https://example.com/wind-turbines",
      "snippet": "Exploring innovative designs for increased energy capture..."
    }
  ]
}
```
```

--------------------------------

TITLE: Search API
DESCRIPTION: Retrieve ranked web search results with advanced filtering and real-time data using the Perplexity Search API.

SOURCE: https://docs.perplexity.ai/guides/getting-started

LANGUAGE: APIDOC
CODE:
```
## GET /search

### Description
Retrieves ranked web search results with advanced filtering and real-time data.

### Method
GET

### Endpoint
/search

### Parameters
#### Query Parameters
- **query** (string) - Required - The search query.
- **page** (integer) - Optional - The page number for search results.
- **limit** (integer) - Optional - The number of results per page.
- **language** (string) - Optional - The language of the search results.
- **country** (string) - Optional - The country for localized search results.
- **safesearch** (string) - Optional - Controls the safety level of the search results (e.g., "moderate", "strict").
- **use_gpt_3_5_turbo** (boolean) - Optional - Whether to use GPT-3.5 Turbo for search query expansion.
- **include_links** (boolean) - Optional - Whether to include links in the search results.
- **include_domains** (array) - Optional - A list of domains to include in the search results.
- **exclude_domains** (array) - Optional - A list of domains to exclude from the search results.
- **start_date** (string) - Optional - The start date for time-bound search results (format: YYYY-MM-DD).
- **end_date** (string) - Optional - The end date for time-bound search results (format: YYYY-MM-DD).

### Request Example
```
GET /search?query=Perplexity%20AI&limit=5
```

### Response
#### Success Response (200)
- **results** (array) - A list of search result objects.
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.
  - **snippet** (string) - A summary or snippet of the search result.
  - **displayed_url** (string) - The displayed URL of the search result.
  - **related_search** (string) - Related search query, if any.
  - **summary** (string) - A more detailed summary of the search result.

#### Response Example
```json
{
  "results": [
    {
      "title": "Perplexity AI - Ask Anything",
      "url": "https://www.perplexity.ai/",
      "snippet": "Perplexity AI is a conversational answer engine that uses large language models to provide accurate and concise answers to your questions.",
      "displayed_url": "www.perplexity.ai",
      "related_search": "Perplexity AI features",
      "summary": "Perplexity AI is a conversational answer engine that uses large language models to provide accurate and concise answers to your questions. It can answer questions on a wide range of topics, including science, history, technology, and more."
    }
  ]
}
```
```

--------------------------------

TITLE: Search API
DESCRIPTION: Retrieve ranked web search results with advanced filtering and real-time data using the Perplexity Search API.

SOURCE: https://docs.perplexity.ai/home

LANGUAGE: APIDOC
CODE:
```
## Search API

### Description
Get ranked web search results with advanced filtering and real-time data.

### Method
POST

### Endpoint
/search

### Parameters
#### Query Parameters
- **query** (array[string]) - Required - The search queries to perform.

### Request Example
```json
{
  "query": [
    "What is Comet Browser?",
    "Perplexity AI",
    "Perplexity Changelog"
  ]
}
```

### Response
#### Success Response (200)
- **results** (array[object]) - A list of search results.
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.

#### Response Example
```json
{
  "results": [
    {
      "title": "Comet Browser - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Comet_Browser"
    },
    {
      "title": "Perplexity AI - AI-powered search engine",
      "url": "https://www.perplexity.ai/"
    }
  ]
}
```
```

--------------------------------

TITLE: Search API
DESCRIPTION: This section covers how to retrieve search results relevant to a query. It includes examples of raw search results and sample search results with metadata.

SOURCE: https://docs.perplexity.ai/getting-started/quickstart

LANGUAGE: APIDOC
CODE:
```
## Search Results

### Description
This endpoint provides search results related to a given query. The results include URLs and snippets from various sources.

### Response
#### Success Response (200)
The response contains an array of URLs that were searched.

#### Response Example
```json
[
  "https://en.wikipedia.org/wiki/2025_French_Open_%E2%80%93_Men's_singles",
  "https://en.wikipedia.org/wiki/2025_French_Open_%E2%80%93_Men's_singles_final",
  "https://www.rolandgarros.com/en-us/matches?status=finished",
  "https://www.tennis.com/news/articles/who-were-the-winners-and-losers-at-2025-roland-garros",
  "https://www.cbssports.com/tennis/news/2025-french-open-results-schedule-as-jannik-sinner-faces-carlos-alcaraz-coco-gauff-earns-first-title/"
]
```

## Sample Search Results

### Description
This provides a sample of the search results, typically the first few entries, with additional metadata like title, URL, date, and snippet.

### Response
#### Success Response (200)
An array of objects, each representing a search result with detailed information.

#### Response Example
```json
[
  {
    "title": "2025 French Open – Men's singles final",
    "url": "https://en.wikipedia.org/wiki/2025_French_Open_%E2%80%93_Men's_singles_final",
    "date": "2025-06-08",
    "last_updated": "2025-08-09",
    "snippet": "After 5 hours and 29 minutes of play, Alcaraz defeated Sinner 4–6, 6–7 (4–7) , 6–4, 7–6 (7–3) , 7–6 (10–2) , in the longest French Open final in history."
  },
  {
    "title": "2025 Roland Garros Men's Singles Tennis Live Scores - ESPN",
    "url": "https://www.espn.com/tennis/scoreboard/tournament/_/eventId/172-2025/competitionType/1",
    "date": "2025-06-08",
    "last_updated": "2025-08-29",
    "snippet": "2025 Roland Garros Scores May 18 - June 8, 2025 Court Philippe-Chatrier, Paris, France Men's Singles 2025 Carlos Alcaraz Defending Champion Carlos Alcaraz."
  }
]
```
```

--------------------------------

TITLE: POST /search - Perplexity Search API
DESCRIPTION: Retrieves ranked search results from Perplexity's continuously refreshed index. You can customize the search with various parameters like maximum results, country, and more.

SOURCE: https://docs.perplexity.ai/api-reference/search-post

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
Retrieves ranked search results from Perplexity's continuously refreshed index with advanced filtering and customization options.

### Method
POST

### Endpoint
https://api.perplexity.ai/search

### Parameters
#### Query Parameters
- **query** (string or array of strings) - Required - The search query or queries to execute. Can be a single query or a list of up to 5 queries for multi-query search.
- **max_results** (integer) - Optional - The maximum number of search results to return. Defaults to 10. Minimum: 1, Maximum: 20.
- **max_tokens_per_page** (integer) - Optional - Controls the maximum number of tokens retrieved from each webpage during search processing. Defaults to 1024.
- **country** (string) - Optional - Country code to filter search results by geographic location (e.g., 'US', 'GB', 'DE').

#### Request Body
(Not applicable for this endpoint as parameters are sent as query parameters)

### Request Example
```json
{
  "query": "latest AI developments 2024",
  "max_results": 10,
  "max_tokens_per_page": 1024,
  "country": "US"
}
```

### Response
#### Success Response (200)
- **results** (array) - An array of search result objects.
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.
  - **snippet** (string) - A brief excerpt or summary of the content.
  - **date** (string) - The date that the page was crawled and added to Perplexity's index (YYYY-MM-DD).
  - **last_updated** (string) - The date that the page was last updated in Perplexity's index (YYYY-MM-DD).

#### Response Example
```json
{
  "results": [
    {
      "title": "<string>",
      "url": "<string>",
      "snippet": "<string>",
      "date": "2025-03-20",
      "last_updated": "2025-09-19"
    }
  ]
}
```
```

--------------------------------

TITLE: Search API Request using cURL
DESCRIPTION: This snippet demonstrates how to perform a search query using the Perplexity AI Search API via cURL. It includes the necessary POST request, URL, authentication header, and a JSON payload containing the search query.

SOURCE: https://docs.perplexity.ai/api-reference

LANGUAGE: cURL
CODE:
```
curl --request POST \
  --url https://api.perplexity.ai/search \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "query": "latest AI developments 2024"
}'
```

--------------------------------

TITLE: Search API
DESCRIPTION: Performs a single search query against the Perplexity AI engine. Users can specify the query text and control the number of results.

SOURCE: https://docs.perplexity.ai/guides/perplexity-sdk-search

LANGUAGE: APIDOC
CODE:
```
## POST /api/search/create

### Description
Executes a single search query to retrieve information on a given topic. This endpoint is the fundamental method for accessing Perplexity AI's knowledge base.

### Method
POST

### Endpoint
/api/search/create

### Parameters
#### Request Body
- **query** (string) - Required - The search term or question.
- **max_results** (integer) - Optional - The maximum number of results to return for the query. Defaults to 5.

### Request Example
```json
{
  "query": "latest advancements in renewable energy",
  "max_results": 10
}
```

### Response
#### Success Response (200)
- **data** (object) - The primary search results.
- **related_queries** (array[string]) - Suggestions for related searches.

#### Response Example
```json
{
  "data": {
    "answer": "Renewable energy has seen significant advancements...",
    "sources": [
      { "url": "http://example.com/source1", "title": "Source One" },
      { "url": "http://example.com/source2", "title": "Source Two" }
    ]
  },
  "related_queries": ["solar power efficiency", "wind turbine technology"]
}
```
```

--------------------------------

TITLE: Search API
DESCRIPTION: Provides search capabilities within the Perplexity AI platform.

SOURCE: https://docs.perplexity.ai/models/models/sonar-deep-research

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
Performs a search query.

### Method
POST

### Endpoint
/search

### Parameters
#### Request Body
- **query** (string) - Required - The search query string.

### Request Example
```json
{
  "query": "What is the capital of France?"
}
```

### Response
#### Success Response (200)
- **results** (array) - A list of search results.
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.
  - **snippet** (string) - A snippet of text from the search result.

#### Response Example
```json
{
  "results": [
    {
      "title": "Paris - Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Paris",
      "snippet": "Paris is the capital and most populous city of France…"
    }
  ]
}
```
```

--------------------------------

TITLE: Search API Endpoint
DESCRIPTION: This section details how to perform a basic search query using the Perplexity AI API. It includes examples for Python, TypeScript, JavaScript, and cURL, along with the expected response structure.

SOURCE: https://docs.perplexity.ai/guides/search-quickstart

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
Performs a search query to retrieve relevant web results.

### Method
POST

### Endpoint
`https://api.perplexity.ai/search`

### Parameters
#### Query Parameters
None

#### Request Body
- **query** (string) - Required - The search query string.
- **max_results** (integer) - Optional - The maximum number of results to return. Defaults to 10.
- **max_tokens_per_page** (integer) - Optional - The maximum number of tokens to include in each result snippet. Defaults to 1024.

### Request Example
```json
{
  "query": "latest AI developments 2024",
  "max_results": 5,
  "max_tokens_per_page": 1024
}
```

### Response
#### Success Response (200)
- **results** (array of objects) - A list of search results.
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.
  - **snippet** (string) - A summary or snippet from the search result.

#### Response Example
```json
{
  "results": [
    {
      "title": "2024: A year of extraordinary progress and advancement in AI - Google Blog",
      "url": "https://blog.google/technology/ai/2024-ai-extraordinary-progress-advancement/",
      "snippet": "## Relentless innovation in models, products and technologies\n\n2024 was a year of experimenting, fast shipping, and putting our latest technologies in the hands of developers..."
    }
  ]
}
```
```

--------------------------------

TITLE: Perform Search Queries with Standalone Search API
DESCRIPTION: The standalone Search API provides direct access to Perplexity's search results without LLM processing. It's suitable for building custom search experiences and integrating raw search data into applications. The API allows specifying the query, maximum number of results, and utilizes existing search filters.

SOURCE: https://docs.perplexity.ai/changelog

LANGUAGE: python
CODE:
```
from perplexity import Perplexity

client = Perplexity()
search = client.search.create(
    query="latest AI developments 2024",
    max_results=10
)

for result in search.results:
    print(f"{result.title}: {result.url}")

```

--------------------------------

TITLE: Basic Search API
DESCRIPTION: Perform a basic search query to retrieve relevant web results. This endpoint allows you to find information based on a given query and control the number of results and tokens per page.

SOURCE: https://docs.perplexity.ai/guides/search-guide

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
Performs a search query to get relevant web results.

### Method
POST

### Endpoint
/search

### Parameters
#### Query Parameters
None

#### Request Body
- **query** (string) - Required - The search query string.
- **max_results** (integer) - Optional - The maximum number of results to return. Defaults to 5.
- **max_tokens_per_page** (integer) - Optional - The maximum number of tokens to retrieve per result page. Defaults to 1024.

### Request Example
```json
{
  "query": "latest AI developments 2024",
  "max_results": 5,
  "max_tokens_per_page": 1024
}
```

### Response
#### Success Response (200)
- **results** (array) - An array of search result objects.
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.
  - **snippet** (string) - A brief snippet or summary from the search result page.

#### Response Example
```json
{
  "results": [
    {
      "title": "The Top Artificial Intelligence Trends - IBM",
      "url": "https://www.ibm.com/think/insights/artificial-intelligence-trends",
      "snippet": "Approaching the midpoint of 2025, we can look back at the prevailing artificial intelligence trends of the year so far—and look ahead to what the rest of the year might bring..."
    }
  ]
}
```
```

--------------------------------

TITLE: Standalone Search API
DESCRIPTION: Provides direct access to Perplexity's search index, returning raw, ranked search results without LLM processing. Ideal for building custom search experiences and integrating search data into applications.

SOURCE: https://docs.perplexity.ai/changelog

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
This endpoint offers direct access to Perplexity's search index, delivering ranked search results without involving LLM processing. It is suitable for applications that require raw search data, custom search interfaces, or integration into specialized workflows.

### Method
POST

### Endpoint
`/search`

### Parameters
#### Query Parameters
- **query** (string) - Required - The search query string.
- **max_results** (integer) - Optional - The maximum number of search results to return. Defaults to 10.

### Request Example
```json
{
  "query": "latest AI developments 2024",
  "max_results": 10
}
```

### Response
#### Success Response (200)
- **results** (array) - An array of search result objects.
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.

#### Response Example
```json
{
  "results": [
    {
      "title": "AI Developments in 2024 - TechCrunch",
      "url": "https://techcrunch.com/ai-developments-2024/"
    },
    {
      "title": "Latest AI Breakthroughs and Trends 2024 - Forbes",
      "url": "https://www.forbes.com/sites/ai-trends-2024/"
    }
  ]
}
```
```

--------------------------------

TITLE: Perform Multi-Query Search with Perplexity SDK
DESCRIPTION: Executes multiple related searches in a single API request. The SDK combines and ranks the results from all queries. Outputs a combined list of search results, including title, URL, and date.

SOURCE: https://docs.perplexity.ai/guides/perplexity-sdk-search

LANGUAGE: python
CODE:
```
search = client.search.create(
    query=[
        "latest AI developments 2024",
        "solar power innovations",
        "wind energy developments"
    ]
)

# Results are combined and ranked
for i, result in enumerate(search.results):
    print(f"{i + 1}. {result.title}")
    print(f"   URL: {result.url}")
    print(f"   Date: {result.date}
")
```

LANGUAGE: typescript
CODE:
```
const search = await client.search.create({
  query: [
    "latest AI developments 2024",
    "solar power innovations",
    "wind energy developments"
  ]
});

// Results are combined and ranked
search.results.forEach((result, index) => {
  console.log(`${index + 1}. ${result.title}`);
  console.log(`   URL: ${result.url}`);
  console.log(`   Date: ${result.date}
`);
});
```

--------------------------------

TITLE: Batch Search API
DESCRIPTION: Demonstrates how to perform searches in batches, with configurable batch sizes and delays between batches. This is useful for efficient searching of multiple queries.

SOURCE: https://docs.perplexity.ai/guides/perplexity-sdk-search

LANGUAGE: APIDOC
CODE:
```
## POST /api/search/batch

### Description
Allows users to perform multiple search queries concurrently in batches. This endpoint facilitates efficient data retrieval by processing queries in groups, with an option to introduce delays between these groups to manage API load or comply with rate limits.

### Method
POST

### Endpoint
/api/search/batch

### Parameters
#### Query Parameters
- **queries** (array[string]) - Required - A list of search queries to execute.
- **batch_size** (integer) - Optional - The number of queries to process in each batch. Defaults to 3.
- **delay_ms** (integer) - Optional - The delay in milliseconds between processing each batch. Defaults to 1000.

### Request Example
```json
{
  "queries": ["AI developments", "climate change", "space exploration"],
  "batch_size": 2,
  "delay_ms": 500
}
```

### Response
#### Success Response (200)
- **results** (array[object]) - A list of search results, where each object contains details for a single query.
  - **query** (string) - The original search query.
  - **data** (object) - The search results data.

#### Response Example
```json
{
  "results": [
    {
      "query": "AI developments",
      "data": { ... }
    },
    {
      "query": "climate change",
      "data": { ... }
    },
    {
      "query": "space exploration",
      "data": { ... }
    }
  ]
}
```
```

--------------------------------

TITLE: API Response Enhancement: Search Results
DESCRIPTION: The API responses now include a `search_results` field, providing direct access to the search data used by the models, including title, URL, and publication date for enhanced transparency.

SOURCE: https://docs.perplexity.ai/changelog

LANGUAGE: APIDOC
CODE:
```
## API Response Structure Update

### Description
API responses have been enhanced with a `search_results` field, which contains detailed information about the web search results used by the models. The `citations` field has been deprecated.

### Response Structure

```json
{
  "id": "chatcmpl-789",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "some-model",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Information about AI research..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  },
  "search_results": [
    {
      "title": "Understanding Large Language Models",
      "url": "https://example.com/llm-article",
      "date": "2023-12-25"
    },
    {
      "title": "Advances in AI Research",
      "url": "https://example.com/ai-research",
      "date": "2024-03-15"
    }
  ]
}
```

### `search_results` Field Details
- **title** (string): The title of the search result page.
- **url** (string): The URL of the search result.
- **date** (string): The publication date of the content.
```

--------------------------------

TITLE: POST /search - Search API
DESCRIPTION: Allows users to perform searches through the Perplexity AI engine. You can query for specific information and receive structured results including titles, URLs, snippets, and dates.

SOURCE: https://docs.perplexity.ai/api-reference

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
Performs a search query using the Perplexity AI engine and returns relevant results.

### Method
POST

### Endpoint
/search

### Parameters
#### Header Parameters
- **Authorization** (string) - Required - Bearer authentication header of the form `Bearer <token>`.

#### Query Parameters
- **query** (string or string[]) - Required - The search query or queries to execute.
- **max_results** (integer) - Optional - The maximum number of search results to return. Defaults to 10. Range: 1 to 20.
- **max_tokens_per_page** (integer) - Optional - Controls the maximum number of tokens retrieved from each webpage. Defaults to 1024.
- **country** (string) - Optional - Country code to filter search results by geographic location (e.g., 'US', 'GB', 'DE').

### Request Example
```json
{
  "query": "latest AI developments 2024"
}
```

### Response
#### Success Response (200)
- **results** (SearchResult[]) - Required - An array of search results.
  - **title** (string)
  - **url** (string)
  - **snippet** (string)
  - **date** (string) - Example: "2025-03-20"
  - **last_updated** (string) - Example: "2025-09-19"

#### Response Example
```json
{
  "results": [
    {
      "title": "<string>",
      "url": "<string>",
      "snippet": "<string>",
      "date": "2025-03-20",
      "last_updated": "2025-09-19"
    }
  ]
}
```
```

--------------------------------

TITLE: Search with Domain Filtering
DESCRIPTION: Limit search results to specific domains or URLs for more focused research. You can specify up to 20 domains.

SOURCE: https://docs.perplexity.ai/guides/search-guide

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
Performs a search query and allows filtering by specific domains.

### Method
POST

### Endpoint
/search

### Parameters
#### Query Parameters
- **query** (string) - Required - The search query.
- **search_domain_filter** (array of strings) - Optional - A list of domains or URLs to filter search results.
- **max_results** (integer) - Optional - The maximum number of results to return.

#### Request Body
- **query** (string) - Required - The search query.
- **search_domain_filter** (array of strings) - Optional - A list of domains or URLs to filter search results. Maximum 20 domains.
- **max_results** (integer) - Optional - The maximum number of results to return.

### Request Example
```json
{
  "query": "climate change research",
  "search_domain_filter": [
    "science.org",
    "pnas.org",
    "cell.com"
  ],
  "max_results": 10
}
```

### Response
#### Success Response (200)
- **results** (array) - A list of search results, where each result contains title, url, and date.

#### Response Example
```json
{
  "results": [
    {
      "title": "Example Article Title",
      "url": "https://example.com/article",
      "date": "2023-10-27"
    }
  ]
}
```
```

--------------------------------

TITLE: Search Modes
DESCRIPTION: Demonstrates how to use different search modes ('web' and 'academic') for various types of queries.

SOURCE: https://docs.perplexity.ai/guides/perplexity-sdk-search

LANGUAGE: APIDOC
CODE:
```
## Search Modes

### Description
Use appropriate search modes to tailor your results. The 'web' mode is suitable for general information and current events, while the 'academic' mode is best for research and academic content.

### Method
POST

### Endpoint
/search/create

### Parameters
#### Query Parameters
- **query** (string) - Required - The search query.
- **search_mode** (string) - Optional - Specifies the search mode. Can be 'web' or 'academic'.
- **search_recency_filter** (string) - Optional - Filters results by recency (e.g., 'day', 'week').
- **search_domain_filter** (array of strings) - Optional - Filters results to specific domains.

### Request Example
```json
{
  "query": "latest tech news",
  "search_mode": "web",
  "search_recency_filter": "day"
}
```

### Response
#### Success Response (200)
- **data** (object) - The search results.

#### Response Example
```json
{
  "data": [
    {
      "title": "Example Article",
      "url": "http://example.com"
    }
  ]
}
```
```

--------------------------------

TITLE: Filter Search by Publication Date (Python, TypeScript, JavaScript, cURL)
DESCRIPTION: Filter search results to include content published within a specified date range. This utilizes 'search_after_date_filter' and 'search_before_date_filter' parameters. Requires the Perplexity client library and an API key.

SOURCE: https://docs.perplexity.ai/guides/search-guide

LANGUAGE: python
CODE:
```
from perplexity import Perplexity

client = Perplexity()

search = client.search.create(
    query="quantum computing breakthroughs",
    search_after_date_filter="01/01/2024",
    search_before_date_filter="12/31/2024"
)

for result in search.results:
    print(f"{result.title}: {result.url}")
    print(f"Published: {result.date}")
    print(f"Last updated: {result.last_updated}")
    print("---")
```

LANGUAGE: typescript
CODE:
```
import Perplexity from '@perplexity_ai/perplexity_ai';

const client = new Perplexity();

const search = await client.search.create({
    query: "quantum computing breakthroughs",
    searchAfterDateFilter: "01/01/2024",
    searchBeforeDateFilter: "12/31/2024"
});

for (const result of search.results) {
    console.log(`${result.title}: ${result.url}`);
    console.log(`Published: ${result.date}`);
    console.log(`Last updated: ${result.lastUpdated}`);
    console.log("---");
}
```

LANGUAGE: javascript
CODE:
```
const Perplexity = require('@perplexity-ai/perplexity_ai');

const client = new Perplexity();

async function main() {
    const search = await client.search.create({
        query: "quantum computing breakthroughs",
        searchAfterDateFilter: "01/01/2024",
        searchBeforeDateFilter: "12/31/2024"
    });

    for (const result of search.results) {
        console.log(`${result.title}: ${result.url}`);
        console.log(`Published: ${result.date}`);
        console.log(`Last updated: ${result.lastUpdated}`);
        console.log("---");
    }
}

main();
```

LANGUAGE: curl
CODE:
```
curl -X POST 'https://api.perplexity.ai/search' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{ \
    "query": "quantum computing breakthroughs", \
    "search_after_date_filter": "01/01/2024", \
    "search_before_date_filter": "12/31/2024" \
  }' | jq
```

--------------------------------

TITLE: Regional Search API
DESCRIPTION: Refine your search results by specifying a country to get more geographically relevant results.

SOURCE: https://docs.perplexity.ai/guides/search-quickstart

LANGUAGE: APIDOC
CODE:
```
## POST /search (Regional)

### Description
This endpoint allows you to perform a search query and retrieve results filtered by a specific country. This is useful for obtaining geographically relevant information.

### Method
POST

### Endpoint
`/search`

### Parameters
#### Query Parameters
- `query` (string) - Required - The search query string.
- `country` (string) - Required - The ISO 3166-1 alpha-2 country code (e.g., "US", "GB", "DE").
- `max_results` (integer) - Optional - The maximum number of results to return. Accepts values from 1 to 20. Defaults to 10.

### Request Example
```json
{
  "query": "government policies on renewable energy",
  "country": "US",
  "max_results": 5
}
```

### Response
#### Success Response (200)
- `results` (array) - An array of search result objects.
  - `title` (string) - The title of the search result.
  - `url` (string) - The URL of the search result.
  - `snippet` (string) - A brief snippet or summary of the search result.

#### Response Example
```json
{
  "results": [
    {
      "title": "US Renewable Energy Policies Overview",
      "url": "https://example.com/us-energy-policy",
      "snippet": "An overview of federal and state policies supporting renewable energy in the United States..."
    },
    {
      "title": "California's Clean Energy Initiatives",
      "url": "https://example.com/california-energy",
      "snippet": "Details on California's leading role in renewable energy adoption..."
    }
  ]
}
```

### Tip
Use ISO 3166-1 alpha-2 country codes (e.g., "US", "GB", "DE", "JP") to target specific regions. This is particularly useful for queries about local news, regulations, or region-specific information.
```

--------------------------------

TITLE: Perform Academic Search using Perplexity AI
DESCRIPTION: This snippet demonstrates how to perform an academic search using the Perplexity AI API. It shows how to query for scholarly articles and retrieve results including titles, snippets, and URLs. Ensure you have the Perplexity library installed for Python, or the relevant SDK for TypeScript/JavaScript. The cURL example requires an API key and jq for formatted output.

SOURCE: https://docs.perplexity.ai/guides/search-guide

LANGUAGE: python
CODE:
```
from perplexity import Perplexity

client = Perplexity()

search = client.search.create(
    query="machine learning algorithms",
    search_mode="academic",
    max_results=10
)

for result in search.results:
    print(f"{result.title}")
    print(f"Journal/Source: {result.snippet}")
    print(f"URL: {result.url}")
    print("---")
```

LANGUAGE: typescript
CODE:
```
import Perplexity from '@perplexity-ai/perplexity_ai';

const client = new Perplexity();

const search = await client.search.create({
    query: "machine learning algorithms",
    searchMode: "academic",
    maxResults: 3
});

for (const result of search.results) {
    console.log(`${result.title}`);
    console.log(`Journal/Source: ${result.snippet}`);
    console.log(`URL: ${result.url}`);
    console.log("---");
}
```

LANGUAGE: javascript
CODE:
```
const Perplexity = require('@perplexity-ai/perplexity_ai');

const client = new Perplexity();

async function main() {
    const search = await client.search.create({
        query: "machine learning algorithms",
        searchMode: "academic",
        maxResults: 3
    });

    for (const result of search.results) {
        console.log(`${result.title}`);
        console.log(`Journal/Source: ${result.snippet}`);
        console.log(`URL: ${result.url}`);
        console.log("---");
    }
}

main();
```

LANGUAGE: bash
CODE:
```
curl -X POST 'https://api.perplexity.ai/search' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "machine learning algorithms",
    "search_mode": "academic",
    "max_results": 3
  }' | jq
```

--------------------------------

TITLE: Multi-Query Search
DESCRIPTION: Perform multiple related queries in a single request for comprehensive research. Supports Python, TypeScript, JavaScript, and cURL.

SOURCE: https://docs.perplexity.ai/guides/search-guide

LANGUAGE: APIDOC
CODE:
```
## POST /search

### Description
Allows for performing multiple related queries in a single API request to gather comprehensive research data.

### Method
POST

### Endpoint
/search

### Parameters
#### Request Body
- **query** (array of strings) - Required - A list of search queries to execute.
- **max_results** (integer) - Optional - The maximum number of results to return per query.

### Request Example
```json
{
  "query": [
    "renewable energy trends 2024",
    "solar power innovations",
    "wind energy developments"
  ],
  "max_results": 3
}
```

### Response
#### Success Response (200)
- **results** (array of objects) - A list of search results, where each result contains:
  - **title** (string) - The title of the search result.
  - **url** (string) - The URL of the search result.
  - **snippet** (string) - A brief snippet of the content from the search result.
```

--------------------------------

TITLE: Web Search Options
DESCRIPTION: Configure how the API searches and utilizes web information. This includes filtering by recency, specifying trusted domains, and setting the maximum number of search results.

SOURCE: https://docs.perplexity.ai/guides/chat-completions-sdk

LANGUAGE: APIDOC
CODE:
```
## Web Search Options

Control how the model searches and uses web information:

### Method
`POST`

### Endpoint
`/chat/completions` (Implied)

### Parameters
#### Request Body
- **web_search_options** (object) - Optional - Options to control web search behavior.
  - **search_recency_filter** (string) - Optional - Filters search results by recency (e.g., 'week', 'month').
  - **search_domain_filter** (array of strings) - Optional - Specifies trusted domains to include in search results.
  - **max_search_results** (integer) - Optional - Maximum number of search results to consider.

### Request Example (Python SDK)
```python
client.chat.completions.create(
    messages=[
        {"role": "user", "content": "What are the latest developments in renewable energy?"}
    ],
    model="sonar",
    web_search_options={
        "search_recency_filter": "week",
        "search_domain_filter": ["energy.gov", "iea.org", "irena.org"],
        "max_search_results": 10
    }
)
```

### Request Example (TypeScript SDK)
```typescript
client.chat.completions.create({
  messages: [
    { role: "user", content: "What are the latest developments in renewable energy?" }
  ],
  model: "sonar",
  search_recency_filter: "week",
  search_domain_filter: ["energy.gov", "iea.org", "irena.org"],
  return_images: true,
  return_related_questions: true
});
```
```

--------------------------------

TITLE: Filtering Results
DESCRIPTION: Illustrates how to use domain and date filters to refine search results for better relevance.

SOURCE: https://docs.perplexity.ai/guides/perplexity-sdk-search

LANGUAGE: APIDOC
CODE:
```
## Filtering Results

### Description
Implement effective filtering using `search_domain_filter` and `search_recency_filter` to improve the quality and relevance of your search results.

### Method
POST

### Endpoint
/search/create

### Parameters
#### Query Parameters
- **query** (string) - Required - The search query.
- **search_domain_filter** (array of strings) - Optional - An array of domain names to restrict the search to (e.g., `["bloomberg.com", "reuters.com"]`).
- **search_recency_filter** (string) - Optional - Filters results by recency. Accepts values like 'day', 'week', 'month', 'year'.

### Request Example
```json
{
  "query": "stock market trends",
  "search_domain_filter": [
    "bloomberg.com",
    "reuters.com",
    "sec.gov",
    "nasdaq.com"
  ],
  "search_recency_filter": "week"
}
```

### Response
#### Success Response (200)
- **data** (object) - The filtered search results.

#### Response Example
```json
{
  "data": [
    {
      "title": "Market Update",
      "url": "http://bloomberg.com/article"
    }
  ]
}
```
```

--------------------------------

TITLE: Web Search Options
DESCRIPTION: Configuration for using web search in model responses. This includes settings for search context size, user location, and image search relevance.

SOURCE: https://docs.perplexity.ai/api-reference/async-chat-completions-post

LANGUAGE: APIDOC
CODE:
```
## Web Search Options

### Description
Configuration for using web search in model responses.

### Parameters
#### Request Body
- **search_context_size** (string) - Optional - Determines how much search context is retrieved for the model. Options are: `low` (minimizes context for cost savings but less comprehensive answers), `medium` (balanced approach suitable for most queries), and `high` (maximizes context for comprehensive answers but at higher cost).
- **user_location** (object) - Optional - To refine search results based on geography, you can specify an approximate user location. For best accuracy, we recommend providing as many fields as possible including city and region.
  - **latitude** (number) - Optional - The latitude of the user's location.
  - **longitude** (number) - Optional - The longitude of the user's location.
  - **country** (string) - Optional - The two letter ISO country code of the user's location.
  - **region** (string) - Optional - The region/state/province of the user's location (e.g., 'California', 'Ontario', 'Île-de-France').
  - **city** (string) - Optional - The city name of the user's location (e.g., 'San Francisco', 'New York City', 'Paris').
- **image_search_relevance_enhanced** (boolean) - Optional - When enabled, improves the relevance of image search results to the user query. Enhanced images will be streamed in later chunks of the response.

### Request Example
```json
{
  "search_context_size": "high",
  "user_location": {
    "country": "US",
    "region": "CA",
    "city": "San Francisco"
  },
  "image_search_relevance_enhanced": true
}
```
```

--------------------------------

TITLE: Filter Search by Last Updated Date (Python, TypeScript, JavaScript, cURL)
DESCRIPTION: Filter search results to include content last modified within a specified date and time range. This utilizes 'last_updated_after_filter' and 'last_updated_before_filter' parameters. Requires the Perplexity client library and an API key.

SOURCE: https://docs.perplexity.ai/guides/search-guide

LANGUAGE: python
CODE:
```
from perplexity import Perplexity

client = Perplexity()

search = client.search.create(
    query="AI safety best practices",
    last_updated_after_filter="2025-01-01T00:00:00Z",
    last_updated_before_filter="2025-06-30T23:59:59Z"
)

for result in search.results:
    print(f"{result.title}: {result.url}")
    print(f"Published: {result.date}")
    print(f"Last updated: {result.last_updated}")
    print("---")
```

LANGUAGE: typescript
CODE:
```
import Perplexity from '@perplexity_ai/perplexity_ai';

const client = new Perplexity();

const search = await client.search.create({
    query: "AI safety best practices",
    lastUpdatedAfterFilter: "2025-01-01T00:00:00Z",
    lastUpdatedBeforeFilter: "2025-06-30T23:59:59Z"
});

for (const result of search.results) {
    console.log(`${result.title}: ${result.url}`);
    console.log(`Published: ${result.date}`);
    console.log(`Last updated: ${result.lastUpdated}`);
    console.log("---");
}
```

LANGUAGE: javascript
CODE:
```
const Perplexity = require('@perplexity-ai/perplexity_ai');

const client = new Perplexity();

async function main() {
    const search = await client.search.create({
        query: "AI safety best practices",
        lastUpdatedAfterFilter: "2025-01-01T00:00:00Z",
        lastUpdatedBeforeFilter: "2025-06-30T23:59:59Z"
    });

    for (const result of search.results) {
        console.log(`${result.title}: ${result.url}`);
        console.log(`Published: ${result.date}`);
        console.log(`Last updated: ${result.lastUpdated}`);
        console.log("---");
    }
}

main();
```

LANGUAGE: curl
CODE:
```
curl -X POST 'https://api.perplexity.ai/search' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{ \
    "query": "AI safety best practices", \
    "last_updated_after_filter": "2025-01-01T00:00:00Z", \
    "last_updated_before_filter": "2025-06-30T23:59:59Z" \
  }' | jq
```