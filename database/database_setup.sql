-- database_setup.sql
-- Create campaign management tables

-- Campaign table to store campaign information
CREATE TABLE email_campaigns (
    campaign_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    status ENUM('draft', 'scheduled', 'running', 'paused', 'completed', 'stopped') DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    start_time DATETIME,
    completed_time DATETIME,
    total_emails INT DEFAULT 0,
    sent_emails INT DEFAULT 0,
    failed_emails INT DEFAULT 0,
    last_processed_id INT DEFAULT 0,
    hourly_limit INT DEFAULT 450,
    description TEXT
);

-- Campaign log table to store individual email sending results
CREATE TABLE email_campaign_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    error_message TEXT,
    sent_time DATETIME,
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(campaign_id) ON DELETE CASCADE,
    INDEX idx_campaign_status (campaign_id, status),
    INDEX idx_email (email)
);

-- Campaign statistics table (for hourly tracking)
CREATE TABLE email_campaign_stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    hour_timestamp DATETIME NOT NULL,
    emails_sent INT DEFAULT 0,
    emails_failed INT DEFAULT 0,
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(campaign_id) ON DELETE CASCADE,
    UNIQUE KEY idx_campaign_hour (campaign_id, hour_timestamp)
);

-- Table to store recipient groups
CREATE TABLE email_recipient_groups (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table to map campaigns to recipient groups
CREATE TABLE campaign_recipient_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(campaign_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES email_recipient_groups(group_id) ON DELETE CASCADE,
    UNIQUE KEY idx_campaign_group (campaign_id, group_id)
);

-- Table to map users to recipient groups
CREATE TABLE user_recipient_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES email_recipient_groups(group_id) ON DELETE CASCADE,
    UNIQUE KEY idx_user_group (user_id, group_id)
);