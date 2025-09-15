<?php
// analytics_data.php - API endpoint for analytics dashboard data

session_start();

// Optional: If you only want authorized users to access these endpoints, uncomment:
// if (!isset($_SESSION['username']) || $_SESSION['username'] !== 'asraf') {
//     header('HTTP/1.1 403 Forbidden');
//     echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
//     exit();
// }

require_once "email_dbcon.php";

// Process API requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $response = ['success' => false, 'message' => 'Invalid request'];
    
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        
        switch ($action) {
            case 'dashboard_stats':
                $response = getDashboardStats($conn);
                break;
                
            case 'campaign_performance':
                $response = getCampaignPerformance($conn);
                break;
                
            case 'email_status_breakdown':
                $response = getEmailStatusBreakdown($conn);
                break;
                
            case 'recent_activity':
                $response = getRecentActivity($conn);
                break;
                
            default:
                $response = ['success' => false, 'message' => 'Invalid action'];
        }
    }
    
    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}

/**
 * Get overall dashboard statistics
 */
function getDashboardStats($conn) {
    // Get campaign counts
    $campaignQuery = "
        SELECT 
            COUNT(*) AS total_campaigns,
            SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) AS active_campaigns,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_campaigns,
            SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft_campaigns,
            SUM(CASE WHEN status = 'paused' THEN 1 ELSE 0 END) AS paused_campaigns,
            SUM(CASE WHEN status = 'stopped' THEN 1 ELSE 0 END) AS stopped_campaigns,
            SUM(sent_emails) AS total_sent,
            SUM(failed_emails) AS total_failed
        FROM email_campaigns
    ";
    $campaignResult = $conn->query($campaignQuery);
    $campaignStats  = $campaignResult->fetch_assoc();

    // Get email status counts
    $emailQuery = "
        SELECT 
            COUNT(*) AS total_emails,
            SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sent_emails,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_emails,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_emails
        FROM email_campaign_logs
    ";
    $emailResult = $conn->query($emailQuery);
    $emailStats  = $emailResult->fetch_assoc();

    // Calculate success rate
    $totalProcessed = ($campaignStats['total_sent'] ?? 0) + ($campaignStats['total_failed'] ?? 0);
    $successRate    = ($totalProcessed > 0)
        ? round(($campaignStats['total_sent'] / $totalProcessed) * 100)
        : 0;
    
    // Get total users and groups
    $userQuery = "SELECT COUNT(*) AS total_users FROM user";
    $userResult = $conn->query($userQuery);
    $userCount  = $userResult->fetch_assoc()['total_users'];
    
    $groupQuery = "SELECT COUNT(*) AS total_groups FROM email_recipient_groups";
    $groupResult = $conn->query($groupQuery);
    $groupCount  = $groupResult->fetch_assoc()['total_groups'];

    // Combine all stats
    $stats = [
        'campaigns' => [
            'total'     => (int)$campaignStats['total_campaigns'],
            'active'    => (int)$campaignStats['active_campaigns'],
            'completed' => (int)$campaignStats['completed_campaigns'],
            'draft'     => (int)$campaignStats['draft_campaigns'],
            'paused'    => (int)$campaignStats['paused_campaigns'],
            'stopped'   => (int)$campaignStats['stopped_campaigns'],
        ],
        'emails' => [
            'sent'         => (int)$campaignStats['total_sent'],
            'failed'       => (int)$campaignStats['total_failed'],
            'pending'      => (int)$emailStats['pending_emails'],
            'success_rate' => $successRate
        ],
        'recipients' => [
            'total_users'  => (int)$userCount,
            'total_groups' => (int)$groupCount
        ]
    ];
    
    return ['success' => true, 'stats' => $stats];
}

/**
 * Get campaign performance data for charts
 */
function getCampaignPerformance($conn) {
    $timeRange   = isset($_GET['range'])       ? $_GET['range']          : 'week';
    $campaignId  = isset($_GET['campaign_id']) ? (int)$_GET['campaign_id'] : null;

    // Define date format / filter
    $dateFormat = '%Y-%m-%d %H:00:00';
    $dateFilter = "";

    switch ($timeRange) {
        case 'day':
            $dateFormat = '%Y-%m-%d %H:00:00';
            $dateFilter = "AND hour_timestamp >= DATE_SUB(NOW(), INTERVAL 1 DAY)";
            break;
        case 'week':
            $dateFormat = '%Y-%m-%d';
            $dateFilter = "AND hour_timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            break;
        case 'month':
            $dateFormat = '%Y-%m-%d';
            $dateFilter = "AND hour_timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
            break;
        case 'all':
            // no filter
            $dateFilter = "";
            break;
    }

    // Campaign filter
    $campaignFilter = ($campaignId) ? "AND campaign_id = $campaignId" : "";

    // Get hourly/daily stats from email_campaign_stats
    $query = "
        SELECT 
            DATE_FORMAT(hour_timestamp, '$dateFormat') AS time_period,
            SUM(emails_sent) AS emails_sent,
            SUM(emails_failed) AS emails_failed
        FROM email_campaign_stats
        WHERE 1=1 $dateFilter $campaignFilter
        GROUP BY time_period
        ORDER BY time_period
    ";
    $result = $conn->query($query);
    if (!$result) {
        return ['success' => false, 'message' => 'Error fetching performance data: ' . $conn->error];
    }

    $performanceData = [];
    while ($row = $result->fetch_assoc()) {
        $performanceData[] = [
            'time_period' => $row['time_period'],
            'sent'  => (int)$row['emails_sent'],
            'failed'=> (int)$row['emails_failed'],
            'total' => (int)$row['emails_sent'] + (int)$row['emails_failed']
        ];
    }

    // Get top performing campaigns
    $topCampaignsQuery = "
        SELECT 
            c.campaign_id,
            c.campaign_name,
            c.sent_emails,
            c.total_emails,
            ROUND(
                (c.sent_emails / (c.sent_emails + c.failed_emails)) * 100, 1
            ) AS success_rate
        FROM email_campaigns c
        WHERE (c.sent_emails + c.failed_emails) > 0
        ORDER BY success_rate DESC, c.sent_emails DESC
        LIMIT 5
    ";
    $topResult = $conn->query($topCampaignsQuery);

    $topCampaigns = [];
    while ($row = $topResult->fetch_assoc()) {
        $progress = 0;
        if ((int)$row['total_emails'] > 0) {
            $progress = round(((int)$row['sent_emails'] / (int)$row['total_emails']) * 100);
        }

        $topCampaigns[] = [
            'id'           => (int)$row['campaign_id'],
            'name'         => $row['campaign_name'],
            'sent'         => (int)$row['sent_emails'],
            'total'        => (int)$row['total_emails'],
            'success_rate' => (float)$row['success_rate'],
            'progress'     => $progress
        ];
    }

    return [
        'success'        => true, 
        'performance'    => $performanceData,
        'top_campaigns'  => $topCampaigns
    ];
}

/**
 * Get email status breakdown
 */
function getEmailStatusBreakdown($conn) {
    $campaignId = isset($_GET['campaign_id']) ? (int)$_GET['campaign_id'] : null;
    $campaignFilter = ($campaignId) ? "WHERE campaign_id = $campaignId" : "";

    $query = "
        SELECT status, COUNT(*) AS count
        FROM email_campaign_logs
        $campaignFilter
        GROUP BY status
    ";
    $result = $conn->query($query);
    if (!$result) {
        return ['success' => false, 'message' => 'Error fetching status breakdown: ' . $conn->error];
    }

    $statusData = [
        'sent'    => 0,
        'failed'  => 0,
        'pending' => 0
    ];
    while ($row = $result->fetch_assoc()) {
        $statusData[$row['status']] = (int)$row['count'];
    }

    // Error breakdown for failed emails
    $errorQuery = "
        SELECT error_message, COUNT(*) AS count
        FROM email_campaign_logs
        WHERE status = 'failed' " . 
        ($campaignId ? "AND campaign_id = $campaignId" : "") . "
        GROUP BY error_message
        ORDER BY count DESC
        LIMIT 5
    ";
    $errorResult = $conn->query($errorQuery);

    $errorBreakdown = [];
    while ($row = $errorResult->fetch_assoc()) {
        $errorMsg = $row['error_message'] ?: 'Unknown error';
        $errorBreakdown[] = [
            'error' => $errorMsg,
            'count' => (int)$row['count']
        ];
    }

    return [
        'success'          => true,
        'status_breakdown' => $statusData,
        'error_breakdown'  => $errorBreakdown
    ];
}

/**
 * Get recent activity
 */
function getRecentActivity($conn) {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

    $query = "
        SELECT 
            l.log_id,
            l.campaign_id,
            c.campaign_name,
            l.email,
            l.status,
            l.error_message,
            l.sent_time,
            CASE 
                WHEN l.status = 'sent' THEN 'Email Sent'
                WHEN l.status = 'failed' THEN 'Email Failed'
                ELSE 'Email Pending'
            END AS activity_type
        FROM email_campaign_logs l
        JOIN email_campaigns c ON l.campaign_id = c.campaign_id
        WHERE l.sent_time IS NOT NULL
        ORDER BY l.sent_time DESC
        LIMIT ?
    ";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $limit);
    $stmt->execute();
    $result = $stmt->get_result();

    $activity = [];
    while ($row = $result->fetch_assoc()) {
        $activity[] = [
            'id'            => (int)$row['log_id'],
            'campaign_id'   => (int)$row['campaign_id'],
            'campaign_name' => $row['campaign_name'],
            'email'         => $row['email'],
            'status'        => $row['status'],
            'error'         => $row['error_message'],
            'time'          => $row['sent_time'],
            'activity_type' => $row['activity_type']
        ];
    }

    // Also get campaign status changes (last 7 days)
    $statusQuery = "
        SELECT 
            campaign_id,
            campaign_name,
            status,
            updated_at
        FROM email_campaigns
        WHERE updated_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
          AND status IN ('running', 'paused', 'completed', 'stopped')
        ORDER BY updated_at DESC
        LIMIT 5
    ";
    $statusResult = $conn->query($statusQuery);

    $statusChanges = [];
    while ($row = $statusResult->fetch_assoc()) {
        $statusText = ucfirst($row['status']);
        if ($row['status'] === 'running') {
            $statusText = 'Started';
        } else if ($row['status'] === 'completed') {
            $statusText = 'Completed';
        }
        $statusChanges[] = [
            'campaign_id'   => (int)$row['campaign_id'],
            'campaign_name' => $row['campaign_name'],
            'status'        => $row['status'],
            'status_text'   => $statusText,
            'time'          => $row['updated_at'],
            'activity_type' => 'Campaign Status Changed'
        ];
    }

    return [
        'success'        => true,
        'activity'       => $activity,
        'status_changes' => $statusChanges
    ];
}
