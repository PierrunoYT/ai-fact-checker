import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

// Ensure data directory exists
const dbDir = path.dirname(CONFIG.DATABASE.PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
const db = new Database(CONFIG.DATABASE.PATH);
db.pragma('journal_mode = WAL'); // Enable Write-Ahead Logging for better performance

// Types
export interface Session {
  id: string;
  type: 'fact-check' | 'exa-search' | 'linkup-search' | 'parallel-search' | 'tavily-search';
  query: string;
  createdAt: string;
  updatedAt: string;
}

export interface FactCheckResult {
  id: string;
  sessionId: string;
  isFactual: boolean;
  confidence: number;
  explanation: string;
  thinking?: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  createdAt: string;
}

export interface FactCheckCitation {
  id: string;
  resultId: string;
  citationId: number;
  url: string;
  title?: string;
  domain?: string;
  snippet?: string;
}

export interface ExaSearchResult {
  id: string;
  sessionId: string;
  searchType: string;
  costDollars?: number;
  requestId?: string;
  totalResults: number;
  createdAt: string;
}

export interface ExaSearchResultItem {
  id: string;
  resultId: string;
  index: number;
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  snippet?: string;
  text?: string;
  summary?: string;
  highlights?: string[];
  relevanceScore?: number;
}

/**
 * Initialize database schema
 */
function initializeDatabase() {
  logger.info('Initializing database schema...');

  // Check if sessions table exists and needs migration
  const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='sessions'").get();
  
  if (tableInfo) {
    // Table exists, check if we need to migrate
    try {
      // Try to insert a test value with new type to see if constraint allows it
      const testStmt = db.prepare("INSERT INTO sessions (id, type, query, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)");
      const testId = 'migration-test-' + Date.now();
      testStmt.run(testId, 'linkup-search', 'test', new Date().toISOString(), new Date().toISOString());
      // If successful, delete the test record
      db.prepare("DELETE FROM sessions WHERE id = ?").run(testId);
      logger.info('Sessions table already supports new session types');
    } catch (error) {
      // Constraint violation means we need to migrate
      logger.info('Migrating sessions table to support new session types...');
      try {
        // Create a new table with the updated constraint
        db.exec(`
          CREATE TABLE sessions_new (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL CHECK(type IN ('fact-check', 'exa-search', 'linkup-search', 'parallel-search', 'tavily-search')),
            query TEXT NOT NULL,
            createdAt TEXT NOT NULL DEFAULT (datetime('now')),
            updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
          )
        `);
        
        // Copy existing data
        db.exec(`
          INSERT INTO sessions_new (id, type, query, createdAt, updatedAt)
          SELECT id, type, query, createdAt, updatedAt FROM sessions
        `);
        
        // Drop old table and rename new one
        db.exec(`
          DROP TABLE sessions;
          ALTER TABLE sessions_new RENAME TO sessions;
        `);
        
        logger.info('Successfully migrated sessions table');
      } catch (migrationError) {
        logger.error('Failed to migrate sessions table:', migrationError);
        // Continue anyway - new table will be created if it doesn't exist
      }
    }
  }
  
  // Create sessions table if it doesn't exist (or recreate after migration)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('fact-check', 'exa-search', 'linkup-search', 'parallel-search', 'tavily-search')),
      query TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Fact check results table
  db.exec(`
    CREATE TABLE IF NOT EXISTS fact_check_results (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      isFactual INTEGER NOT NULL,
      confidence REAL NOT NULL,
      explanation TEXT NOT NULL,
      thinking TEXT,
      model TEXT,
      usage_prompt_tokens INTEGER,
      usage_completion_tokens INTEGER,
      usage_total_tokens INTEGER,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `);

  // Fact check citations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS fact_check_citations (
      id TEXT PRIMARY KEY,
      resultId TEXT NOT NULL,
      citationId INTEGER NOT NULL,
      url TEXT NOT NULL,
      title TEXT,
      domain TEXT,
      snippet TEXT,
      FOREIGN KEY (resultId) REFERENCES fact_check_results(id) ON DELETE CASCADE
    )
  `);

  // Exa search results table
  db.exec(`
    CREATE TABLE IF NOT EXISTS exa_search_results (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      searchType TEXT NOT NULL,
      costDollars REAL,
      requestId TEXT,
      totalResults INTEGER NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE
    )
  `);

  // Exa search result items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS exa_search_result_items (
      id TEXT PRIMARY KEY,
      resultId TEXT NOT NULL,
      "index" INTEGER NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      publishedDate TEXT,
      author TEXT,
      snippet TEXT,
      text TEXT,
      summary TEXT,
      highlights TEXT,
      relevanceScore REAL,
      FOREIGN KEY (resultId) REFERENCES exa_search_results(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);
    CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_fact_check_results_session ON fact_check_results(sessionId);
    CREATE INDEX IF NOT EXISTS idx_fact_check_citations_result ON fact_check_citations(resultId);
    CREATE INDEX IF NOT EXISTS idx_exa_search_results_session ON exa_search_results(sessionId);
    CREATE INDEX IF NOT EXISTS idx_exa_search_result_items_result ON exa_search_result_items(resultId);
  `);

  logger.info('Database schema initialized successfully');
}

// Initialize on module load
initializeDatabase();

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Session operations
 */
export const sessionDb = {
  /**
   * Create a new session
   */
  create(type: 'fact-check' | 'exa-search' | 'linkup-search' | 'parallel-search' | 'tavily-search', query: string): Session {
    const id = generateId();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO sessions (id, type, query, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, type, query, now, now);
    
    return {
      id,
      type,
      query,
      createdAt: now,
      updatedAt: now
    };
  },

  /**
   * Get session by ID
   */
  getById(id: string): Session | null {
    const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      id: row.id,
      type: row.type,
      query: row.query,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  },

  /**
   * Get all sessions with pagination
   */
  getAll(limit: number = 50, offset: number = 0, type?: 'fact-check' | 'exa-search' | 'linkup-search' | 'parallel-search' | 'tavily-search'): Session[] {
    let query = 'SELECT * FROM sessions';
    const params: any[] = [];
    
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as any[];
    
    return rows.map(row => ({
      id: row.id,
      type: row.type,
      query: row.query,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  },

  /**
   * Update session
   */
  update(id: string, query?: string): void {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (query !== undefined) {
      updates.push('query = ?');
      params.push(query);
    }
    
    updates.push('updatedAt = ?');
    params.push(new Date().toISOString());
    params.push(id);
    
    const stmt = db.prepare(`UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...params);
  },

  /**
   * Delete session and all related data
   */
  delete(id: string): void {
    const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
    stmt.run(id);
  },

  /**
   * Get session count
   */
  count(type?: 'fact-check' | 'exa-search' | 'linkup-search' | 'parallel-search' | 'tavily-search'): number {
    let query = 'SELECT COUNT(*) as count FROM sessions';
    const params: any[] = [];
    
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    const stmt = db.prepare(query);
    const result = stmt.get(...params) as { count: number };
    return result.count;
  }
};

/**
 * Fact check result operations
 */
export const factCheckDb = {
  /**
   * Save fact check result
   */
  save(sessionId: string, result: {
    isFactual: boolean;
    confidence: number;
    explanation: string;
    thinking?: string;
    model?: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    citations?: Array<{
      id: number;
      url: string;
      title?: string;
      domain?: string;
      snippet?: string;
    }>;
  }): FactCheckResult {
    const id = generateId();
    const now = new Date().toISOString();
    
    // Insert result
    const resultStmt = db.prepare(`
      INSERT INTO fact_check_results (
        id, sessionId, isFactual, confidence, explanation, thinking, model,
        usage_prompt_tokens, usage_completion_tokens, usage_total_tokens, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    resultStmt.run(
      id,
      sessionId,
      result.isFactual ? 1 : 0,
      result.confidence,
      result.explanation,
      result.thinking || null,
      result.model || null,
      result.usage?.prompt_tokens || null,
      result.usage?.completion_tokens || null,
      result.usage?.total_tokens || null,
      now
    );
    
    // Insert citations
    if (result.citations && result.citations.length > 0) {
      const citationStmt = db.prepare(`
        INSERT INTO fact_check_citations (id, resultId, citationId, url, title, domain, snippet)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const insertCitation = db.transaction((citation: typeof result.citations[0]) => {
        citationStmt.run(
          generateId(),
          id,
          citation.id,
          citation.url,
          citation.title || null,
          citation.domain || null,
          citation.snippet || null
        );
      });
      
      result.citations.forEach(insertCitation);
    }
    
    // Update session
    sessionDb.update(sessionId);
    
    return {
      id,
      sessionId,
      isFactual: result.isFactual,
      confidence: result.confidence,
      explanation: result.explanation,
      thinking: result.thinking,
      model: result.model,
      usage: result.usage,
      createdAt: now
    };
  },

  /**
   * Get result by ID with citations
   */
  getById(id: string): (FactCheckResult & { citations: FactCheckCitation[] }) | null {
    const resultStmt = db.prepare('SELECT * FROM fact_check_results WHERE id = ?');
    const result = resultStmt.get(id) as any;
    
    if (!result) return null;
    
    const citationStmt = db.prepare('SELECT * FROM fact_check_citations WHERE resultId = ? ORDER BY citationId');
    const citations = citationStmt.all(id) as any[];
    
    return {
      id: result.id,
      sessionId: result.sessionId,
      isFactual: result.isFactual === 1,
      confidence: result.confidence,
      explanation: result.explanation,
      thinking: result.thinking,
      model: result.model,
      usage: result.usage_prompt_tokens ? {
        prompt_tokens: result.usage_prompt_tokens,
        completion_tokens: result.usage_completion_tokens,
        total_tokens: result.usage_total_tokens
      } : undefined,
      createdAt: result.createdAt,
      citations: citations.map(c => ({
        id: c.id,
        resultId: c.resultId,
        citationId: c.citationId,
        url: c.url,
        title: c.title,
        domain: c.domain,
        snippet: c.snippet
      }))
    };
  },

  /**
   * Get results by session ID
   */
  getBySessionId(sessionId: string): FactCheckResult[] {
    const stmt = db.prepare('SELECT * FROM fact_check_results WHERE sessionId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(sessionId) as any[];
    
    return rows.map(row => ({
      id: row.id,
      sessionId: row.sessionId,
      isFactual: row.isFactual === 1,
      confidence: row.confidence,
      explanation: row.explanation,
      thinking: row.thinking,
      model: row.model,
      usage: row.usage_prompt_tokens ? {
        prompt_tokens: row.usage_prompt_tokens,
        completion_tokens: row.usage_completion_tokens,
        total_tokens: row.usage_total_tokens
      } : undefined,
      createdAt: row.createdAt
    }));
  }
};

/**
 * Exa search result operations
 */
export const exaSearchDb = {
  /**
   * Save Exa search result
   */
  save(sessionId: string, result: {
    searchType: string;
    costDollars?: number;
    requestId?: string;
    results: Array<{
      title: string;
      url: string;
      publishedDate?: string;
      author?: string;
      snippet?: string;
      text?: string;
      summary?: string;
      highlights?: string[];
      relevanceScore?: number;
    }>;
  }): ExaSearchResult {
    const id = generateId();
    const now = new Date().toISOString();
    
    // Insert result
    const resultStmt = db.prepare(`
      INSERT INTO exa_search_results (
        id, sessionId, searchType, costDollars, requestId, totalResults, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    resultStmt.run(
      id,
      sessionId,
      result.searchType,
      result.costDollars || null,
      result.requestId || null,
      result.results.length,
      now
    );
    
      // Insert result items
      if (result.results.length > 0) {
        const itemStmt = db.prepare(`
          INSERT INTO exa_search_result_items (
            id, resultId, "index", title, url, publishedDate, author, snippet, text, summary, highlights, relevanceScore
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const insertItem = db.transaction((item: typeof result.results[0], index: number) => {
          itemStmt.run(
            generateId(),
            id,
            index,
            item.title,
            item.url,
            item.publishedDate || null,
            item.author || null,
            item.snippet || null,
            item.text || null,
            item.summary || null,
            item.highlights ? JSON.stringify(item.highlights) : null,
            item.relevanceScore || null
          );
        });
        
        result.results.forEach((item, index) => insertItem(item, index));
      }
    
    // Update session
    sessionDb.update(sessionId);
    
    return {
      id,
      sessionId,
      searchType: result.searchType,
      costDollars: result.costDollars,
      requestId: result.requestId,
      totalResults: result.results.length,
      createdAt: now
    };
  },

  /**
   * Get result by ID with items
   */
  getById(id: string): (ExaSearchResult & { items: ExaSearchResultItem[] }) | null {
    const resultStmt = db.prepare('SELECT * FROM exa_search_results WHERE id = ?');
    const result = resultStmt.get(id) as any;
    
    if (!result) return null;
    
    const itemStmt = db.prepare('SELECT * FROM exa_search_result_items WHERE resultId = ? ORDER BY "index"');
    const items = itemStmt.all(id) as any[];
    
    return {
      id: result.id,
      sessionId: result.sessionId,
      searchType: result.searchType,
      costDollars: result.costDollars,
      requestId: result.requestId,
      totalResults: result.totalResults,
      createdAt: result.createdAt,
      items: items.map(item => ({
        id: item.id,
        resultId: item.resultId,
        index: item.index,
        title: item.title,
        url: item.url,
        publishedDate: item.publishedDate,
        author: item.author,
        snippet: item.snippet,
        text: item.text,
        summary: item.summary,
        highlights: item.highlights ? JSON.parse(item.highlights) : undefined,
        relevanceScore: item.relevanceScore
      }))
    };
  },

  /**
   * Get results by session ID
   */
  getBySessionId(sessionId: string): ExaSearchResult[] {
    const stmt = db.prepare('SELECT * FROM exa_search_results WHERE sessionId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(sessionId) as any[];
    
    return rows.map(row => ({
      id: row.id,
      sessionId: row.sessionId,
      searchType: row.searchType,
      costDollars: row.costDollars,
      requestId: row.requestId,
      totalResults: row.totalResults,
      createdAt: row.createdAt
    }));
  }
};

/**
 * Close database connection
 */
export function closeDatabase(): void {
  db.close();
  logger.info('Database connection closed');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

