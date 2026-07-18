CREATE TABLE `ai_calls` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text,
	`feature` text NOT NULL,
	`model` text NOT NULL,
	`duration_ms` integer NOT NULL,
	`input_tokens` integer DEFAULT 0 NOT NULL,
	`output_tokens` integer DEFAULT 0 NOT NULL,
	`total_tokens` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`error_code` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ai_calls_created_at_idx` ON `ai_calls` (`created_at`);--> statement-breakpoint
CREATE INDEX `ai_calls_feature_idx` ON `ai_calls` (`feature`);--> statement-breakpoint
CREATE TABLE `app_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value_json` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_token_usage` (
	`usage_date` text PRIMARY KEY NOT NULL,
	`input_tokens` integer DEFAULT 0 NOT NULL,
	`output_tokens` integer DEFAULT 0 NOT NULL,
	`total_tokens` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `error_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`module` text NOT NULL,
	`error_code` text,
	`message` text NOT NULL,
	`stack` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `error_logs_created_at_idx` ON `error_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `operation_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`level` text NOT NULL,
	`module` text NOT NULL,
	`action` text NOT NULL,
	`summary` text NOT NULL,
	`details_json` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `operation_logs_created_at_idx` ON `operation_logs` (`created_at`);