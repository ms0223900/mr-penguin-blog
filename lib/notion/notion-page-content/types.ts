/**
 * Type definitions for Notion Page Content Module
 * These types define the structure of Notion pages and blocks for content extraction
 */

import { ListBlockChildrenParameters, ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

// Notion block types enum
export enum NotionBlockType {
  PARAGRAPH = 'paragraph',
  HEADING_1 = 'heading_1',
  HEADING_2 = 'heading_2',
  HEADING_3 = 'heading_3',
  BULLETED_LIST_ITEM = 'bulleted_list_item',
  NUMBERED_LIST_ITEM = 'numbered_list_item',
  TO_DO = 'to_do',
  CODE = 'code',
  QUOTE = 'quote',
  CALLOUT = 'callout',
  DIVIDER = 'divider'
}

// Basic Notion page interface
export interface NotionPage {
  id: string;
  url: string;
  properties: Record<string, any>;
  created_time?: string;
  last_edited_time?: string;
}

// Notion block interface
export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
  children?: NotionBlock[];
  has_children?: boolean;
}

// Page content structure - represents a page with its blocks and extracted content
export interface PageContent {
  page?: NotionPage;
  blocks?: NotionBlock[];
  content: string;
}

// Result of page content extraction
export interface PageContentResult {
  success: boolean;
  data?: PageContent;
  error?: string;
}

// Rich text content structure (simplified for content extraction)
export interface RichTextContent {
  plain_text?: string;
  text?: {
    content: string;
  };
}

// Configuration interface for Notion client
export interface INotionConfig {
  getToken(): string;
}

// Service interfaces
export interface INotionClientService {
  testConnection(): Promise<boolean>;
  getPage(pageId: string): Promise<NotionPage>;
  getPageBlocks(params: ListBlockChildrenParameters): Promise<ListBlockChildrenResponse>;
  getAllBlocks(blockId: string): Promise<NotionBlock[]>;
}

export interface IPageQueryService {
  getPageData(pageId: string): Promise<PageContent>;
  getPagesData(pageIds: string[]): Promise<PageContent[]>;
}

export interface IContentExtractor {
  extractContent(pageData: PageContent): PageContentResult;
}

// Error handling types
export interface NotionError extends Error {
  code?: string;
  status?: number;
}

// Optional logger interface for better abstraction
export interface ILogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  success(message: string): void;
}

// Optional error handler decorator type
export type ErrorHandlerDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor;