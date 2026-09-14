import { sqliteTable,text } from 'drizzle-orm/sqlite-core';
export const content=sqliteTable('content',{id:text('id').primaryKey(),payload:text('payload').notNull(),updated:text('updated').notNull()});
export const feedback=sqliteTable('feedback',{id:text('id').primaryKey(),contentId:text('content_id').notNull().references(()=>content.id,{onDelete:'cascade'}),userId:text('user_id').notNull(),author:text('author').notNull(),text:text('text').notNull(),createdAt:text('created_at').notNull()});
export const reviews=sqliteTable('reviews',{id:text('id').primaryKey(),contentId:text('content_id').notNull().references(()=>content.id,{onDelete:'cascade'}),userId:text('user_id').notNull(),author:text('author').notNull(),decision:text('decision').notNull(),createdAt:text('created_at').notNull()});
export const managers=sqliteTable('managers',{id:text('id').primaryKey()});
