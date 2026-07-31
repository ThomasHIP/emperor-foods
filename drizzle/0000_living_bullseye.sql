CREATE TABLE `corporate_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`quantity` integer NOT NULL,
	`message` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`order_no` text NOT NULL,
	`public_token` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_json` text NOT NULL,
	`items_json` text NOT NULL,
	`gift_box` text NOT NULL,
	`coupon_code` text,
	`subtotal_satang` integer NOT NULL,
	`total_pieces` integer NOT NULL,
	`status` text DEFAULT 'awaiting_confirmation' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`payment_reference` text,
	`payment_url` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_no_unique` ON `orders` (`order_no`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_public_token_unique` ON `orders` (`public_token`);--> statement-breakpoint
CREATE TABLE `vouchers` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`code` text NOT NULL,
	`value_satang` integer DEFAULT 20000 NOT NULL,
	`status` text DEFAULT 'issued' NOT NULL,
	`expiry_date` text NOT NULL,
	`redeemed_policy` text,
	`redeemed_vehicle` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vouchers_code_unique` ON `vouchers` (`code`);