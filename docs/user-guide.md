# QMS Hub - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Application Overview](#application-overview)
3. [User Interface Guide](#user-interface-guide)
4. [CAR Management Workflow](#car-management-workflow)
5. [Navigation Guide](#navigation-guide)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing the Application
1. **Open your web browser** and navigate to: `http://77.237.241.186:3010/landing`
2. **Sign up** for a new account or **sign in** with existing credentials
3. **Complete your profile** with organization information

### First Time Setup
- Create your user account with email and password
- Provide your organization name for data segregation
- Contact your system administrator for organization setup if needed

## Application Overview

QMS Hub is a Corrective Action Request (CAR) management system designed to streamline quality management processes. The application guides users through a structured workflow from problem identification to resolution.

### Key Features
- **CAR Lifecycle Management**: Complete workflow from creation to closure
- **Multiple Root Cause Analysis Methods**: Fishbone, Simple, and Immediate analysis
- **Organization-based Data Isolation**: Secure, organization-specific data access
- **Real-time Collaboration**: Multi-user support with context-aware navigation
- **Status Tracking**: Visual indicators for CAR progress and deadlines

## User Interface Guide

### Home Page (Landing Page)
**URL**: `http://localhost:3010/landing`

The landing page serves as your main dashboard and includes:

#### Header Section
- **QMS Hub Logo**: Application branding
- **Navigation**: Home icon for easy navigation
- **User Context**: Shows you're logged into the correct system

#### Welcome Section
- **Personalized Greeting**: "Hello, [Your Name]"
- **Organization Context**: Shows your organization name
- **Quick Action**: "Create CAR" button for immediate CAR creation

#### CAR Logs Table
A comprehensive table showing all CARs for your organization:

| Column | Description |
|--------|-------------|
| **Action** | Pencil icon to edit existing CARs |
| **CAR Number** | Unique identifier for each CAR |
| **Initiation Date** | When the CAR was created |
| **Source** | Origin of the problem (CCN, IA, Supplier Audit, etc.) |
| **Target Date** | Deadline for CAR completion |

#### Status Indicators
- **Red Text**: Overdue CARs (past target date)
- **Orange Text**: CARs due within 7 days
- **Black Text**: Future CARs

### Authentication Pages

#### Sign Up (`http://localhost:3010/sign-up`)
- Create new user account
- Provide organization information
- Set secure password

#### Sign In (`http://localhost:3010/sign-in`)
- Access existing account
- JWT-based secure authentication
- Remember me functionality

## CAR Management Workflow

### Creating a New CAR
1. **From Landing Page**: Click "Create CAR" button
2. **It will Navigate to**: `http://localhost:3010/create-car`
3. **Follow the guided workflow** through these steps:

#### Step 1: Problem Description
- **CAR Number**: Unique identifier (auto-generated or manual)
- **Initiation Date**: Date when problem was identified
- **Initiator**: Person who identified the problem
- **Recipient**: Person responsible for addressing the problem
- **Coordinator**: Person coordinating the CAR process
- **CAR Source**: Origin of the problem
- **Problem Description**: Detailed problem description with evidence
- **Planning Phases**: Set responsibilities and target dates

#### Step 2: Look Across (Problem Redefinition)
- **Redefined Problem**: Clarified problem statement
- **Correction**: Immediate corrective actions taken
- **Containment**: Actions to prevent problem spread
- **Date**: When correction/containment was implemented

#### Step 3: Validate CA Need
- **CA Required**: Assessment of corrective action necessity
- **Required By**: Who requires the corrective action
- **Comments**: Additional context
- **Severity/Occurrence/RPN**: Risk assessment metrics
- **CA Needed**: Final determination

#### Step 4: Define RCA Type
Choose the appropriate root cause analysis method:
- **Fishbone Analysis**: Comprehensive cause-and-effect analysis
- **Simple Root Cause Analysis**: Structured simple analysis
- **Immediate Cause Only**: Focus on immediate causes

#### Step 5: Root Cause Analysis
Based on your selection in Step 4:
- **Fishbone Analysis**: Complete the fishbone diagram
- **Simple Root Cause Analysis**: Fill in the analysis matrix
- **Immediate Root Cause Analysis**: Document immediate causes

#### Step 6: Corrective Action Plan
- **Root Cause**: Identified root cause
- **Corrective Action**: Specific action to address root cause
- **Responsibility**: Person responsible for implementation
- **Target Date**: When action should be completed
- **Status**: Current status of the action

#### Step 7: CA Effectiveness Plan
- **Planned Action**: Verification activities
- **Responsibility**: Person responsible for verification
- **Target Date**: When verification should be completed
- **Status**: Current verification status

#### Step 8: QMS Process Training
- **QMS Required**: Whether QMS process updates are needed
- **Documentation Required**: Documentation updates needed
- **Training Required**: Training activities required
- **Comments**: Additional requirements and context

### Editing Existing CARs
1. **From Landing Page**: Click the pencil icon next to any CAR
2. **Navigate to**: `http://localhost:3010/create-car/?car_number=[CAR_NUMBER]`
3. **Modify any step** in the workflow
4. **Save changes** as you progress through the steps

## Navigation Guide

### Main Navigation
- **Landing Page**: `http://localhost:3010/landing` - Main dashboard
- **Create CAR**: `http://localhost:3010/create-car` - New CAR workflow
- **Sign In**: `http://localhost:3010/sign-in` - User authentication
- **Sign Up**: `http://localhost:3010/sign-up` - User registration

### CAR Workflow Navigation
The CAR creation process is linear with these navigation options:
- **Previous Button**: Navigate to previous step (when available)
- **Next Button**: Proceed to next step (after completing current step)
- **Step Indicators**: Visual progress through the workflow

### Context-Aware Navigation
- **User Context**: Always shows your name and organization
- **CAR Context**: Maintains CAR data throughout the workflow
- **State Persistence**: Form data is preserved during navigation

*This user guide provides comprehensive information for end users of the QMS Hub application. For technical details about the system architecture, please refer to the Technical Architecture Document.*
