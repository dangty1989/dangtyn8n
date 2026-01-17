# Google Sheets Database Structure

This document outlines the required structure for the Google Sheets that will act as the database for the Construction Management Automation System.

## Sheet: `Projects`
Used for Workflow #1 and Workflow #5.

| Column | Type | Description |
| :--- | :--- | :--- |
| `project_id` | ID | Unique identifier for the project |
| `name` | String | Project name |
| `client` | String | Client name |
| `start_date` | Date | Official start date |
| `end_date_prop` | Date | Proposed end date |
| `budget` | Number | Total project budget (VNĐ) |
| `progress` | Percentage | Manual or calculated completion % |
| `status` | Enum | `on-track`, `warning`, `danger` |

## Sheet: `Workers`
Used for Workflow #3.

| Column | Type | Description |
| :--- | :--- | :--- |
| `worker_id` | ID | Unique identifier |
| `full_name` | String | Worker's full name |
| `skill_level` | Number | 1-5 stars |
| `base_salary` | Number | Daily wage |
| `allowances` | Number | Fixed daily allowances |

## Sheet: `DailyLogs`
Used for Workflow #2 and Workflow #3.

| Column | Type | Description |
| :--- | :--- | :--- |
| `date` | Date | Log date |
| `project_id` | ID | Link to project |
| `worker_id` | ID | Link to worker |
| `work_type` | String | e.g., Tường, Sàn, Sơn |
| `volume` | Number | Work volume completed (m², m³, etc.) |
| `is_dangerous` | Boolean | TRUE if danger allowance applies |
| `hours_ov` | Number | Overtime hours |

## Sheet: `Financials`
Used for Workflow #5.

| Column | Type | Description |
| :--- | :--- | :--- |
| `date` | Date | Transaction date |
| `project_id` | ID | Link to project |
| `category` | Enum | `Labor`, `Material`, `Equipment`, `Other` |
| `amount` | Number | Cost/Revenue amount |
| `description` | String | Detail |
