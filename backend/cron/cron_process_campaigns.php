<?php
// cron_process_campaigns.php - Set this to run every few minutes via cron job

// Prevent web access
if (php_sapi_name() !== 'cli') {
    die('This script can only be executed via CLI.');
}

// Include the database connection
require_once "email_dbcon.php";
require 'vendor/autoload.php'; // Include Composer's autoloader

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Log function
function logMessage($message) {
    $timestamp = date('Y-m-d H:i:s');
    echo "[$timestamp] $message" . PHP_EOL;
    // Optionally write to log file
    file_put_contents(__DIR__ . '/campaign_log.txt', "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

// Main log entry - starting the script
logMessage("Script started");

try {
    // Get active campaigns that are running
    logMessage("Fetching active campaigns");
    $query = "SELECT * FROM email_campaigns WHERE status = 'running'";
    $result = mysqli_query($conn, $query);

    if (!$result) {
        logMessage("Error fetching campaigns: " . mysqli_error($conn));
        exit(1);
    }

    $campaignCount = mysqli_num_rows($result);
    logMessage("Found $campaignCount active campaigns");

    if ($campaignCount == 0) {
        logMessage("No active campaigns to process.");
        exit(0);
    }

    logMessage("Starting to process $campaignCount active campaigns");

    // Process each active campaign
    while ($campaign = mysqli_fetch_assoc($result)) {
        processCampaign($conn, $campaign);
    }
    
    logMessage("Script completed successfully");
} catch (Exception $e) {
    logMessage("Error in main process: " . $e->getMessage());
    logMessage("Stack trace: " . $e->getTraceAsString());
    exit(1);
}

// Main function to process a campaign
function processCampaign($conn, $campaign) {
    $campaign_id = $campaign['campaign_id'];
    logMessage("Processing campaign ID: $campaign_id - {$campaign['campaign_name']}");
    
    try {
        // Check if we've reached the hourly limit
        $currentHour = date('Y-m-d H:00:00');
        logMessage("Current hour timestamp: $currentHour");
        
        // Get the count of emails sent in the current hour for this campaign
        logMessage("Checking hourly emails sent");
        $hourlyQuery = "SELECT SUM(emails_sent) as sent_count FROM email_campaign_stats 
                        WHERE campaign_id = ? AND hour_timestamp = ?";
        $stmt = $conn->prepare($hourlyQuery);
        
        if (!$stmt) {
            logMessage("Error preparing hourly query: " . $conn->error);
            return;
        }
        
        $stmt->bind_param('is', $campaign_id, $currentHour);
        $stmt->execute();
        $hourlyResult = $stmt->get_result();
        $hourlyData = $hourlyResult->fetch_assoc();
        
        $sentInCurrentHour = $hourlyData['sent_count'] ?? 0;
        $hourlyLimit = $campaign['hourly_limit'];
        
        logMessage("Current hour: $currentHour, Sent in current hour: $sentInCurrentHour, Hourly limit: $hourlyLimit");
        
        if ($sentInCurrentHour >= $hourlyLimit) {
            logMessage("Hourly limit of $hourlyLimit emails reached for campaign $campaign_id. Will resume in the next hour.");
            return;
        }
        
        // Calculate how many emails we can still send this hour
        $remainingQuota = $hourlyLimit - $sentInCurrentHour;
        logMessage("Remaining quota for this hour: $remainingQuota emails");
        
        // Get the batch of emails to process (limit to remaining quota)
        $batchSize = min(50, $remainingQuota); // Process in smaller batches of 50 or less
        logMessage("Processing batch size: $batchSize");
        
        // Get last processed ID
        $lastProcessedId = $campaign['last_processed_id'];
        logMessage("Last processed ID: $lastProcessedId");
        
        // Get emails that are pending for this campaign
        logMessage("Preparing to fetch emails to process");
        
        // Debug the query construction
        $emailQuery = "SELECT u.id as user_id, u.email 
                       FROM user u
                       JOIN user_recipient_groups urg ON u.id = urg.user_id
                       JOIN campaign_recipient_groups crg ON urg.group_id = crg.group_id
                       LEFT JOIN email_campaign_logs ecl ON (
                           ecl.campaign_id = ? AND 
                           ecl.email = u.email
                       )
                       WHERE crg.campaign_id = ? 
                       AND (ecl.status IS NULL OR ecl.status = 'pending')
                       AND u.id > ?
                       ORDER BY u.id
                       LIMIT ?";
                       
        logMessage("Email query: " . $emailQuery);
        
        $stmt = $conn->prepare($emailQuery);
        
        if (!$stmt) {
            logMessage("Error preparing email query: " . $conn->error);
            return;
        }
        
        logMessage("Email query prepared, binding parameters");
        $stmt->bind_param('iiii', $campaign_id, $campaign_id, $lastProcessedId, $batchSize);
        
        logMessage("Executing email query");
        $stmt->execute();
        $emailsResult = $stmt->get_result();
        
        $emailCount = $emailsResult->num_rows;
        logMessage("Found $emailCount emails to process");
        
        if ($emailCount == 0) {
            // No more emails to process for this campaign
            logMessage("No more emails to send for campaign $campaign_id. Marking as completed.");
            
            // Update campaign status to completed
            $updateQuery = "UPDATE email_campaigns SET 
                            status = 'completed', 
                            completed_time = NOW() 
                            WHERE campaign_id = ?";
            $stmt = $conn->prepare($updateQuery);
            
            if (!$stmt) {
                logMessage("Error preparing campaign update query: " . $conn->error);
                return;
            }
            
            $stmt->bind_param('i', $campaign_id);
            $stmt->execute();
            return;
        }
        
        // Process each email
        $successCount = 0;
        $failureCount = 0;
        $lastId = $lastProcessedId;
        
        while ($recipient = $emailsResult->fetch_assoc()) {
            $email = $recipient['email'];
            $userId = $recipient['user_id'];
            $lastId = max($lastId, $userId);
            
            logMessage("Processing email for user ID: $userId, Email: $email");
            
            // First, check if we already have a log entry for this email
            $checkQuery = "SELECT log_id, status FROM email_campaign_logs 
                           WHERE campaign_id = ? AND email = ?";
            $stmt = $conn->prepare($checkQuery);
            
            if (!$stmt) {
                logMessage("Error preparing log check query: " . $conn->error);
                continue;
            }
            
            $stmt->bind_param('is', $campaign_id, $email);
            $stmt->execute();
            $logResult = $stmt->get_result();
            
            if ($logResult->num_rows > 0) {
                $logEntry = $logResult->fetch_assoc();
                logMessage("Found existing log entry with status: " . $logEntry['status']);
                
                // If already processed successfully, skip it
                if ($logEntry['status'] == 'sent') {
                    logMessage("Email already sent, skipping");
                    continue;
                }
                
                // If pending or failed, we'll try again and update the existing log
                $logId = $logEntry['log_id'];
                logMessage("Will update existing log ID: $logId");
            } else {
                // Create a new log entry with pending status
                logMessage("Creating new log entry for this email");
                $insertLogQuery = "INSERT INTO email_campaign_logs 
                                  (campaign_id, email, status) 
                                  VALUES (?, ?, 'pending')";
                $stmt = $conn->prepare($insertLogQuery);
                
                if (!$stmt) {
                    logMessage("Error preparing log insert query: " . $conn->error);
                    continue;
                }
                
                $stmt->bind_param('is', $campaign_id, $email);
                $stmt->execute();
                $logId = $conn->insert_id;
                logMessage("Created new log entry with ID: $logId");
            }
            
            // Send the email
            logMessage("Attempting to send email to: $email");
            $result = sendEmail($email, $campaign['subject'], $campaign['body']);
            
            if ($result['success']) {
                // Update log to sent
                logMessage("Email sent successfully");
                $updateLogQuery = "UPDATE email_campaign_logs 
                                  SET status = 'sent', sent_time = NOW(), error_message = NULL 
                                  WHERE log_id = ?";
                $stmt = $conn->prepare($updateLogQuery);
                
                if (!$stmt) {
                    logMessage("Error preparing log update query: " . $conn->error);
                    continue;
                }
                
                $stmt->bind_param('i', $logId);
                $stmt->execute();
                
                $successCount++;
            } else {
                // Update log to failed with error message
                $errorMsg = $result['error'];
                logMessage("Failed to send email: $errorMsg");
                $updateLogQuery = "UPDATE email_campaign_logs 
                                  SET status = 'failed', error_message = ? 
                                  WHERE log_id = ?";
                $stmt = $conn->prepare($updateLogQuery);
                
                if (!$stmt) {
                    logMessage("Error preparing failed log update query: " . $conn->error);
                    continue;
                }
                
                $stmt->bind_param('si', $errorMsg, $logId);
                $stmt->execute();
                
                $failureCount++;
            }
            
            // Short pause to avoid overwhelming the mail server
            logMessage("Pausing for 0.5 seconds before next email");
            usleep(500000); // 0.5 second pause
        }
        
        logMessage("Batch processing complete. Success: $successCount, Failed: $failureCount");
        
        // Update campaign statistics
        logMessage("Updating hourly statistics");
        
        // Update the hourly stats
        $updateStatsQuery = "INSERT INTO email_campaign_stats 
                            (campaign_id, hour_timestamp, emails_sent, emails_failed) 
                            VALUES (?, ?, ?, ?) 
                            ON DUPLICATE KEY UPDATE 
                            emails_sent = emails_sent + ?, 
                            emails_failed = emails_failed + ?";
        
        $stmt = $conn->prepare($updateStatsQuery);
        
        if (!$stmt) {
            logMessage("Error preparing stats update query: " . $conn->error);
            return;
        }
        
        $stmt->bind_param('issiii', $campaign_id, $currentHour, $successCount, $failureCount, $successCount, $failureCount);
        $stmt->execute();
        
        // Update the campaign totals and last processed ID
        logMessage("Updating campaign totals and last processed ID: $lastId");
        $updateCampaignQuery = "UPDATE email_campaigns SET 
                               sent_emails = sent_emails + ?, 
                               failed_emails = failed_emails + ?,
                               last_processed_id = ? 
                               WHERE campaign_id = ?";
        
        $stmt = $conn->prepare($updateCampaignQuery);
        
        if (!$stmt) {
            logMessage("Error preparing campaign update query: " . $conn->error);
            return;
        }
        
        $stmt->bind_param('iiii', $successCount, $failureCount, $lastId, $campaign_id);
        $stmt->execute();
        
        logMessage("Campaign $campaign_id processed batch: $successCount successful, $failureCount failed. Last ID: $lastId");
    } catch (Exception $e) {
        logMessage("Error processing campaign: " . $e->getMessage());
        logMessage("Stack trace: " . $e->getTraceAsString());
    }
}

// Function to send an email
function sendEmail($email, $subject, $body) {
    logMessage("sendEmail function called for: $email");
    $mail = new PHPMailer(true);
    $result = ['success' => false, 'error' => ''];
    
    try {
        // SMTP Server settings
        $mail->isSMTP();
        $mail->Host = "mail.privateemail.com";
        $mail->SMTPAuth = true;
        $mail->Username = "admin@coolkeypoint.com";
        $mail->Password = "@@11Zaman@Boks@@11(--!--)";
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        logMessage("SMTP settings configured");
        
        $mail->setFrom("admin@coolkeypoint.com", "Coolkeypoint");
        $mail->addAddress($email);
        
        logMessage("Email addresses set");

        // Sanitize and format email body
        $body = htmlspecialchars_decode($body, ENT_QUOTES);
        $body = nl2br(htmlspecialchars($body, ENT_QUOTES, 'UTF-8'));
        
        logMessage("Email body formatted");

        // Email Template
        $emailTemplate = "
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Important Notice</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                    }
                    h2 {
                        color: #333333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                        border-radius: 8px;
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo img {
                        max-width: 150px;
                    }
                    .content {
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                    }
                    .content p {
                        margin-bottom: 15px;
                        color: #555555;
                    }
                    .content ul {
                        list-style: none;
                        padding: 0;
                    }
                    .content ul li {
                        margin-bottom: 10px;
                    }
                    .content a {
                        color: #007bff;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #888888;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='logo'>
                        <h1>Coolkeypoint</h1>
                    </div>
                    <div class='content'>
                        <h3>Dear Coolkeypoint User,</h3>
                        <p style='font-size: 14px;'>$body</p>
                    </div>
                    <div class='footer'>
                        <p>Thank you</p>
                        <p>Coolkeypoint.com</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        // Email format and content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $emailTemplate;
        $mail->CharSet = 'UTF-8';
        
        logMessage("Email content set up, attempting to send");

        // Send the email
        $mail->send();
        $result['success'] = true;
        logMessage("Email successfully sent");

    } catch (Exception $e) {
        $result['error'] = $mail->ErrorInfo;
        logMessage("Email sending failed: " . $mail->ErrorInfo);
    }

    return $result;
}