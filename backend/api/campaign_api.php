<?php
// campaign_api.php - API endpoints for campaign management

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once "email_dbcon.php";

// Process API requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = ['success' => false, 'message' => 'Invalid request'];
    
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        
        switch ($action) {
            case 'create_campaign':
                $response = createCampaign($conn);
                break;
                
            case 'start_campaign':
                $response = updateCampaignStatus($conn, 'running');
                break;
                
            case 'pause_campaign':
                $response = updateCampaignStatus($conn, 'paused');
                break;
                
            case 'resume_campaign':
                $response = updateCampaignStatus($conn, 'running');
                break;
                
            case 'stop_campaign':
                $response = updateCampaignStatus($conn, 'stopped');
                break;
                
            case 'delete_campaign':
                $response = deleteCampaign($conn);
                break;
                
            case 'create_recipient_group':
                $response = createRecipientGroup($conn);
                break;
                
            case 'add_users_to_group':
                $response = addUsersToGroup($conn);
                break;
                
            case 'get_campaign_details':
                $response = getCampaignDetails($conn);
                break;
                
            case 'update_campaign':
                $response = updateCampaign($conn);
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

// Create a new campaign
function createCampaign($conn) {
    if (!isset($_POST['campaign_name']) || !isset($_POST['subject']) || !isset($_POST['body'])) {
        return ['success' => false, 'message' => 'Missing required fields'];
    }
    
    $campaignName = $_POST['campaign_name'];
    $subject = $_POST['subject'];
    $body = $_POST['body'];
    $description = $_POST['description'] ?? '';
    $hourlyLimit = isset($_POST['hourly_limit']) ? intval($_POST['hourly_limit']) : 450;
    $status = 'draft';
    
    // Insert campaign
    $query = "INSERT INTO email_campaigns (campaign_name, subject, body, status, hourly_limit, description) 
             VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssssis', $campaignName, $subject, $body, $status, $hourlyLimit, $description);
    
    if (!$stmt->execute()) {
        return ['success' => false, 'message' => 'Failed to create campaign: ' . $conn->error];
    }
    
    $campaign_id = $conn->insert_id;
    
    // Associate recipient groups if provided
    if (isset($_POST['recipient_groups']) && is_array($_POST['recipient_groups'])) {
        $groupInsertQuery = "INSERT INTO campaign_recipient_groups (campaign_id, group_id) VALUES (?, ?)";
        $groupStmt = $conn->prepare($groupInsertQuery);
        
        foreach ($_POST['recipient_groups'] as $group_id) {
            $groupStmt->bind_param('ii', $campaign_id, $group_id);
            $groupStmt->execute();
        }
        
        // Count total recipients for this campaign
        $recipientCountQuery = "SELECT COUNT(DISTINCT urg.user_id) as total 
                               FROM campaign_recipient_groups crg 
                               JOIN user_recipient_groups urg ON crg.group_id = urg.group_id 
                               WHERE crg.campaign_id = ?";
        $countStmt = $conn->prepare($recipientCountQuery);
        $countStmt->bind_param('i', $campaign_id);
        $countStmt->execute();
        $totalResult = $countStmt->get_result();
        $totalRecipients = $totalResult->fetch_assoc()['total'];
        
        // Update the campaign with total_emails count
        $updateTotalQuery = "UPDATE email_campaigns SET total_emails = ? WHERE campaign_id = ?";
        $updateStmt = $conn->prepare($updateTotalQuery);
        $updateStmt->bind_param('ii', $totalRecipients, $campaign_id);
        $updateStmt->execute();
    }
    
    return ['success' => true, 'message' => 'Campaign created successfully!', 'campaign_id' => $campaign_id];
}

// Update campaign status (start, pause, resume, stop)
function updateCampaignStatus($conn, $newStatus) {
    if (!isset($_POST['campaign_id'])) {
        return ['success' => false, 'message' => 'Campaign ID is required'];
    }
    
    $campaign_id = $_POST['campaign_id'];
    $updateFields = "status = ?";
    $params = [$newStatus, $campaign_id];
    $types = "si";
    
    // If starting campaign, set start time
    if ($newStatus === 'running') {
        $campaignQuery = "SELECT status FROM email_campaigns WHERE campaign_id = ?";
        $campaignStmt = $conn->prepare($campaignQuery);
        $campaignStmt->bind_param('i', $campaign_id);
        $campaignStmt->execute();
        $result = $campaignStmt->get_result();
        
        if ($result->num_rows === 0) {
            return ['success' => false, 'message' => 'Campaign not found'];
        }
        
        $campaign = $result->fetch_assoc();
        
        // If this is the first time running (from draft/scheduled), set start_time
        if ($campaign['status'] === 'draft' || $campaign['status'] === 'scheduled') {
            $updateFields .= ", start_time = NOW()";
        }
    }
    
    // If stopping campaign, set completed_time
    if ($newStatus === 'stopped' || $newStatus === 'completed') {
        $updateFields .= ", completed_time = NOW()";
    }
    
    $query = "UPDATE email_campaigns SET " . $updateFields . " WHERE campaign_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    
    if (!$stmt->execute()) {
        return ['success' => false, 'message' => 'Failed to update campaign status: ' . $conn->error];
    }
    
    $statusMap = [
        'running' => 'started',
        'paused' => 'paused',
        'stopped' => 'stopped',
        'completed' => 'completed'
    ];
    
    $actionText = $statusMap[$newStatus] ?? $newStatus;
    
    return ['success' => true, 'message' => 'Campaign ' . $actionText . ' successfully!'];
}

// Delete campaign
function deleteCampaign($conn) {
    if (!isset($_POST['campaign_id'])) {
        return ['success' => false, 'message' => 'Campaign ID is required'];
    }
    
    $campaign_id = $_POST['campaign_id'];
    
    // Check if the campaign can be deleted (not running)
    $checkQuery = "SELECT status FROM email_campaigns WHERE campaign_id = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param('i', $campaign_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['success' => false, 'message' => 'Campaign not found'];
    }
    
    $campaign = $result->fetch_assoc();
    
    if ($campaign['status'] === 'running') {
        return ['success' => false, 'message' => 'Cannot delete a running campaign. Please stop it first.'];
    }
    
    // Delete campaign
    $query = "DELETE FROM email_campaigns WHERE campaign_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $campaign_id);
    
    if (!$stmt->execute()) {
        return ['success' => false, 'message' => 'Failed to delete campaign: ' . $conn->error];
    }
    
    return ['success' => true, 'message' => 'Campaign deleted successfully!'];
}

// Create recipient group
function createRecipientGroup($conn) {
    if (!isset($_POST['group_name'])) {
        return ['success' => false, 'message' => 'Group name is required'];
    }
    
    $groupName = $_POST['group_name'];
    $description = $_POST['description'] ?? '';
    
    $query = "INSERT INTO email_recipient_groups (group_name, description) VALUES (?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ss', $groupName, $description);
    
    if (!$stmt->execute()) {
        return ['success' => false, 'message' => 'Failed to create recipient group: ' . $conn->error];
    }
    
    $group_id = $conn->insert_id;
    
    return ['success' => true, 'message' => 'Recipient group created successfully!', 'group_id' => $group_id];
}

// Add users to a recipient group
// Add users to a recipient group
function addUsersToGroup($conn) {
    if (!isset($_POST['group_id']) || !isset($_POST['offset']) || !isset($_POST['limit'])) {
        return ['success' => false, 'message' => 'Missing required parameters'];
    }
    
    $group_id = $_POST['group_id'];
    $offset = intval($_POST['offset']);
    $limit = intval($_POST['limit']);
    
    // Verify the group exists
    $checkQuery = "SELECT group_id FROM email_recipient_groups WHERE group_id = ?";
    $checkStmt = $conn->prepare($checkQuery);
    if (!$checkStmt) {
        return ['success' => false, 'message' => 'Database error: ' . $conn->error];
    }
    
    $checkStmt->bind_param('i', $group_id);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows === 0) {
        return ['success' => false, 'message' => 'Recipient group not found'];
    }
    
    // Get users from the specified range - UPDATED COLUMN NAME FROM user_id TO id
    $userQuery = "SELECT id FROM user LIMIT ?, ?";
    $stmt = $conn->prepare($userQuery);
    if (!$stmt) {
        return ['success' => false, 'message' => 'Database error: ' . $conn->error];
    }
    
    $stmt->bind_param('ii', $offset, $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $insertCount = 0;
    
    // Insert each user into the group
    while ($user = $result->fetch_assoc()) {
        $userId = $user['id']; // UPDATED FROM user_id TO id
        
        // Check if this user is already in the group - UPDATED user_id TO user_id in query
        $checkUserQuery = "SELECT id FROM user_recipient_groups WHERE user_id = ? AND group_id = ?";
        $checkUserStmt = $conn->prepare($checkUserQuery);
        if (!$checkUserStmt) {
            continue; // Skip this user if query fails
        }
        
        $checkUserStmt->bind_param('ii', $userId, $group_id);
        $checkUserStmt->execute();
        
        if ($checkUserStmt->get_result()->num_rows === 0) {
            // Add user to group
            $insertQuery = "INSERT INTO user_recipient_groups (user_id, group_id) VALUES (?, ?)";
            $insertStmt = $conn->prepare($insertQuery);
            if (!$insertStmt) {
                continue; // Skip this user if query fails
            }
            
            $insertStmt->bind_param('ii', $userId, $group_id);
            
            if ($insertStmt->execute()) {
                $insertCount++;
            }
        }
    }
    
    return ['success' => true, 'message' => "$insertCount users added to the group successfully!"];
}

// Get campaign details
function getCampaignDetails($conn) {
    if (!isset($_POST['campaign_id'])) {
        return ['success' => false, 'message' => 'Campaign ID is required'];
    }
    
    $campaign_id = $_POST['campaign_id'];
    
    // Get campaign data
    $query = "SELECT c.*, 
             (SELECT COUNT(DISTINCT urg.user_id) 
              FROM campaign_recipient_groups crg 
              JOIN user_recipient_groups urg ON crg.group_id = urg.group_id 
              WHERE crg.campaign_id = c.campaign_id) as total_recipients
             FROM email_campaigns c 
             WHERE c.campaign_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $campaign_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['success' => false, 'message' => 'Campaign not found'];
    }
    
    $campaign = $result->fetch_assoc();
    
    // Get associated recipient groups
    $groupsQuery = "SELECT g.group_id, g.group_name, COUNT(urg.user_id) as member_count 
                   FROM email_recipient_groups g 
                   JOIN campaign_recipient_groups crg ON g.group_id = crg.group_id 
                   LEFT JOIN user_recipient_groups urg ON g.group_id = urg.group_id 
                   WHERE crg.campaign_id = ? 
                   GROUP BY g.group_id";
    
    $groupsStmt = $conn->prepare($groupsQuery);
    $groupsStmt->bind_param('i', $campaign_id);
    $groupsStmt->execute();
    $groupsResult = $groupsStmt->get_result();
    
    $groups = [];
    while ($group = $groupsResult->fetch_assoc()) {
        $groups[] = $group;
    }
    
    // Get email statistics
    $statsQuery = "SELECT 
                  COUNT(*) as total,
                  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
                  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
                  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
                  FROM email_campaign_logs
                  WHERE campaign_id = ?";
    
    $statsStmt = $conn->prepare($statsQuery);
    $statsStmt->bind_param('i', $campaign_id);
    $statsStmt->execute();
    $stats = $statsStmt->get_result()->fetch_assoc();
    
    // Get hourly data for charts
    $hourlyQuery = "SELECT hour_timestamp, emails_sent, emails_failed
                   FROM email_campaign_stats
                   WHERE campaign_id = ?
                   ORDER BY hour_timestamp";
    
    $hourlyStmt = $conn->prepare($hourlyQuery);
    $hourlyStmt->bind_param('i', $campaign_id);
    $hourlyStmt->execute();
    $hourlyResult = $hourlyStmt->get_result();
    
    $hourlyData = [];
    while ($hour = $hourlyResult->fetch_assoc()) {
        $hourlyData[] = $hour;
    }
    
    // Combine all data
    $data = [
        'campaign' => $campaign,
        'groups' => $groups,
        'stats' => $stats,
        'hourly_data' => $hourlyData
    ];
    
    return ['success' => true, 'data' => $data];
}

// Update campaign details
function updateCampaign($conn) {
    if (!isset($_POST['campaign_id'])) {
        return ['success' => false, 'message' => 'Campaign ID is required'];
    }
    
    $campaign_id = $_POST['campaign_id'];
    
    // Check if the campaign can be updated (draft status only)
    $checkQuery = "SELECT status FROM email_campaigns WHERE campaign_id = ?";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param('i', $campaign_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        return ['success' => false, 'message' => 'Campaign not found'];
    }
    
    $campaign = $result->fetch_assoc();
    
    if ($campaign['status'] !== 'draft') {
        return ['success' => false, 'message' => 'Only draft campaigns can be updated'];
    }
    
    // Prepare update data
    $updates = [];
    $params = [];
    $types = '';
    
    // Optional fields to update
    $fields = [
        'campaign_name' => 's',
        'subject' => 's',
        'body' => 's',
        'hourly_limit' => 'i',
        'description' => 's'
    ];
    
    foreach ($fields as $field => $type) {
        if (isset($_POST[$field])) {
            $updates[] = "$field = ?";
            $params[] = $_POST[$field];
            $types .= $type;
        }
    }
    
    if (empty($updates)) {
        return ['success' => false, 'message' => 'No fields to update'];
    }
    
    // Add campaign_id to params
    $params[] = $campaign_id;
    $types .= 'i';
    
    // Update campaign
    $query = "UPDATE email_campaigns SET " . implode(', ', $updates) . " WHERE campaign_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    
    if (!$stmt->execute()) {
        return ['success' => false, 'message' => 'Failed to update campaign: ' . $conn->error];
    }
    
    // Update recipient groups if provided
    if (isset($_POST['recipient_groups']) && is_array($_POST['recipient_groups'])) {
        // Remove existing groups
        $deleteQuery = "DELETE FROM campaign_recipient_groups WHERE campaign_id = ?";
        $deleteStmt = $conn->prepare($deleteQuery);
        $deleteStmt->bind_param('i', $campaign_id);
        $deleteStmt->execute();
        
        // Add new groups
        $groupInsertQuery = "INSERT INTO campaign_recipient_groups (campaign_id, group_id) VALUES (?, ?)";
        $groupStmt = $conn->prepare($groupInsertQuery);
        
        foreach ($_POST['recipient_groups'] as $group_id) {
            $groupStmt->bind_param('ii', $campaign_id, $group_id);
            $groupStmt->execute();
        }
        
        // Count total recipients for this campaign
        $recipientCountQuery = "SELECT COUNT(DISTINCT urg.user_id) as total 
                               FROM campaign_recipient_groups crg 
                               JOIN user_recipient_groups urg ON crg.group_id = urg.group_id 
                               WHERE crg.campaign_id = ?";
        $countStmt = $conn->prepare($recipientCountQuery);
        $countStmt->bind_param('i', $campaign_id);
        $countStmt->execute();
        $totalResult = $countStmt->get_result();
        $totalRecipients = $totalResult->fetch_assoc()['total'];
        
        // Update the campaign with total_emails count
        $updateTotalQuery = "UPDATE email_campaigns SET total_emails = ? WHERE campaign_id = ?";
        $updateStmt = $conn->prepare($updateTotalQuery);
        $updateStmt->bind_param('ii', $totalRecipients, $campaign_id);
        $updateStmt->execute();
    }
    
    return ['success' => true, 'message' => 'Campaign updated successfully!'];
}