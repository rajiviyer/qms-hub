# QMS Hub - Production Deployment Guide

## Table of Contents
1. [Deployment Options Comparison](#deployment-options-comparison)
2. [Recommended: DigitalOcean App Platform](#recommended-digitalocean-app-platform)
3. [Alternative: Railway](#alternative-railway)
4. [Enterprise: AWS ECS with Fargate](#enterprise-aws-ecs-with-fargate)
5. [Pre-Deployment Checklist](#pre-deployment-checklist)
6. [Security Considerations](#security-considerations)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Cost Optimization](#cost-optimization)

## Deployment Options Comparison

| Platform | Monthly Cost | Ease of Use | Scalability | Best For |
|----------|-------------|-------------|-------------|----------|
| **Contabo VPS** | $5-15 | ⭐⭐⭐ | ⭐⭐⭐ | **Budget-Conscious** |
| **DigitalOcean App Platform** | $27-40 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Recommended** |
| **Railway** | $10-25 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Small to Medium |
| **AWS ECS Fargate** | $40-80 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Enterprise |
| **Google Cloud Run** | $30-60 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | High Traffic |
| **Azure Container Instances** | $35-70 | ⭐⭐⭐ | ⭐⭐⭐⭐ | Microsoft Ecosystem |

## 🏆 Budget Option: Contabo VPS

### Why Contabo VPS?
- **Extremely Cost-Effective**: $5-15/month for complete setup
- **High Performance**: Dedicated resources, no shared hosting
- **Full Control**: Complete server control and customization
- **Global Data Centers**: 12 locations across 9 regions
- **Docker Ready**: Perfect for containerized applications
- **High Resources**: More RAM and storage than managed platforms

### Contabo VPS Plans for QMS Hub

#### **VPS M (Recommended)**
- **Price**: €4.50/month (~$5/month)
- **CPU**: 3 vCPU cores
- **RAM**: 8 GB
- **Storage**: 75 GB NVMe SSD
- **Traffic**: 32 TB/month
- **Perfect for**: Small to medium QMS Hub deployments

#### **VPS L (High Performance)**
- **Price**: €8.99/month (~$10/month)
- **CPU**: 4 vCPU cores
- **RAM**: 16 GB
- **Storage**: 160 GB NVMe SSD
- **Traffic**: 32 TB/month
- **Perfect for**: High-traffic or multiple client deployments

#### **VPS XL (Enterprise)**
- **Price**: €17.99/month (~$20/month)
- **CPU**: 6 vCPU cores
- **RAM**: 32 GB
- **Storage**: 320 GB NVMe SSD
- **Traffic**: 32 TB/month
- **Perfect for**: Large-scale deployments with many clients

### Step-by-Step Contabo Deployment

#### 1. Server Setup
```bash
# 1. Create Contabo account and order VPS
# 2. Choose Ubuntu 22.04 LTS
# 3. Select your preferred data center location
# 4. Wait for server provisioning (5-10 minutes)
```

#### 2. Initial Server Configuration
```bash
# Connect to your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/qms-hub
cd /opt/qms-hub
```

#### 3. Deploy QMS Hub
```bash
# Clone your repository
git clone https://github.com/yourusername/qms-hub.git .

# Create production environment file
cat > backend/app/.env << EOF
DB_URL=postgresql://postgres:your_secure_password@localhost:5432/qmsdb
DB_SCHEMA=public
SECRET_KEY=your-super-secure-secret-key-here
ACCESS_EXPIRY_TIME=60
REFRESH_EXPIRY_TIME=7
ALGORITHM=HS256
EOF

# Create frontend environment file
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://your-server-ip:8910
EOF

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

#### 4. Configure Reverse Proxy (Nginx)
```bash
# Install Nginx
apt install nginx -y

# Create Nginx configuration
cat > /etc/nginx/sites-available/qms-hub << EOF
server {
    listen 80;
    server_name your-domain.com your-server-ip;

    # Frontend
    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8910/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/qms-hub /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

#### 5. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 6. Firewall Configuration
```bash
# Configure UFW firewall
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable

# Check status
ufw status
```

### Contabo Advantages
- **Cost**: 80% cheaper than managed platforms
- **Performance**: Dedicated resources, no shared hosting
- **Control**: Full server control and customization
- **Resources**: More RAM and storage for the price
- **Global**: Multiple data center locations
- **Docker**: Perfect for containerized applications

### Contabo Considerations
- **Management**: Requires server administration skills
- **Support**: Limited support compared to managed platforms
- **Uptime**: 95% uptime guarantee (vs 99.9% for managed)
- **Scaling**: Manual scaling vs automatic
- **Backups**: Manual backup configuration required

### Estimated Monthly Cost: $5-20
- **VPS M**: $5/month (8GB RAM, 3 vCPU)
- **VPS L**: $10/month (16GB RAM, 4 vCPU)
- **VPS XL**: $20/month (32GB RAM, 6 vCPU)
- **Domain**: $10-15/year (optional)
- **SSL**: Free (Let's Encrypt)

---

## Recommended: DigitalOcean App Platform

### Why DigitalOcean App Platform?
- **Zero DevOps**: Fully managed platform
- **Docker Native**: Perfect for your existing setup
- **Cost-Effective**: $27-40/month for complete setup
- **Easy Scaling**: Automatic scaling based on traffic
- **Built-in CI/CD**: GitHub integration
- **SSL/HTTPS**: Automatic SSL certificates
- **Global CDN**: Fast content delivery

### Step-by-Step Deployment

#### 1. Pre-Deployment Setup

**Update Environment Variables:**
```bash
# Create production environment file
# backend/app/.env
DB_URL=postgresql://postgres:your_secure_password@your-db-host:5432/qmsdb
DB_SCHEMA=public
SECRET_KEY=your-super-secure-secret-key-here
ACCESS_EXPIRY_TIME=60
REFRESH_EXPIRY_TIME=7
ALGORITHM=HS256
```

**Update Frontend Configuration:**
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

#### 2. DigitalOcean App Platform Setup

1. **Create DigitalOcean Account**
   - Sign up at [digitalocean.com](https://digitalocean.com)
   - Add payment method

2. **Create New App**
   - Go to Apps → Create App
   - Connect your GitHub repository
   - Select the repository and branch

3. **Configure Services**

   **Frontend Service:**
   ```yaml
   Name: qms-hub-frontend
   Source: ./frontend
   Build Command: npm run build
   Run Command: npm start
   Port: 3010
   Environment Variables:
     - NODE_ENV=production
     - NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

   **Backend Service:**
   ```yaml
   Name: qms-hub-backend
   Source: ./backend
   Build Command: pip install -r requirements.txt
   Run Command: uvicorn app.route:app --host 0.0.0.0 --port 8910
   Port: 8910
   Environment Variables:
     - DB_URL=postgresql://postgres:password@db:5432/qmsdb
     - SECRET_KEY=your-secret-key
     - ACCESS_EXPIRY_TIME=60
     - REFRESH_EXPIRY_TIME=7
     - ALGORITHM=HS256
   ```

   **Database Service:**
   ```yaml
   Name: qms-hub-database
   Type: Managed Database
   Engine: PostgreSQL 16
   Plan: Basic ($15/month)
   Size: 1GB RAM, 10GB Storage
   ```

4. **Deploy Application**
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)
   - Access your app at the provided URL

#### 3. Post-Deployment Configuration

**Update DNS (if using custom domain):**
```bash
# Add CNAME record pointing to your app URL
# Example: app.yourdomain.com → your-app.ondigitalocean.app
```

**Configure SSL:**
- SSL is automatically configured
- Custom domain SSL takes 5-10 minutes to provision

### Estimated Monthly Cost: $27-40
- **Frontend**: $12/month (Basic plan)
- **Backend**: $12/month (Basic plan)
- **Database**: $15/month (1GB RAM, 10GB storage)
- **Total**: $39/month

---

## Alternative: Railway

### Why Railway?
- **Extremely Simple**: Deploy in minutes
- **Very Cost-Effective**: $10-25/month
- **Docker Support**: Native Docker deployment
- **Database Included**: PostgreSQL managed service
- **Automatic Deployments**: Git-based deployments

### Step-by-Step Deployment

#### 1. Railway Setup
1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)
   - Connect GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Services**
   - **Frontend**: Select `./frontend` directory
   - **Backend**: Select `./backend` directory
   - **Database**: Add PostgreSQL service

4. **Set Environment Variables**
   ```bash
   # Backend
   DB_URL=${{Postgres.DATABASE_URL}}
   SECRET_KEY=your-secret-key
   ACCESS_EXPIRY_TIME=60
   REFRESH_EXPIRY_TIME=7
   ALGORITHM=HS256
   
   # Frontend
   NEXT_PUBLIC_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

5. **Deploy**
   - Railway automatically builds and deploys
   - Get your app URL from the dashboard

### Estimated Monthly Cost: $10-25
- **Hobby Plan**: $5/month (512MB RAM)
- **Pro Plan**: $20/month (8GB RAM)
- **Database**: $5/month (1GB storage)

---

## Enterprise: AWS ECS with Fargate

### Why AWS ECS?
- **Highly Scalable**: Enterprise-grade
- **Cost-Effective for Scale**: Pay only for what you use
- **Managed Database**: RDS PostgreSQL
- **Global CDN**: CloudFront for frontend
- **Security**: VPC, IAM, encryption

### Step-by-Step Deployment

#### 1. AWS Setup
1. **Create AWS Account**
   - Sign up at [aws.amazon.com](https://aws.amazon.com)
   - Set up billing alerts

2. **Create ECS Cluster**
   ```bash
   # Using AWS CLI
   aws ecs create-cluster --cluster-name qms-hub-cluster
   ```

3. **Create RDS Database**
   ```bash
   # Create RDS PostgreSQL instance
   aws rds create-db-instance \
     --db-instance-identifier qms-hub-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username postgres \
     --master-user-password your-secure-password \
     --allocated-storage 20
   ```

4. **Deploy Services**
   - Create ECS task definitions
   - Deploy frontend and backend services
   - Configure load balancer

### Estimated Monthly Cost: $40-80
- **Fargate**: $15-30/month (0.5-1 vCPU, 1-2GB RAM)
- **RDS PostgreSQL**: $25-50/month (db.t3.micro)
- **CloudFront**: $1-5/month (data transfer)

---

## Pre-Deployment Checklist

### Security Checklist
- [ ] **Change default passwords** (database, admin accounts)
- [ ] **Generate secure secret keys** (JWT, encryption)
- [ ] **Configure CORS** for production domains
- [ ] **Set up SSL/HTTPS** certificates
- [ ] **Configure firewall** rules
- [ ] **Enable database encryption** at rest
- [ ] **Set up backup** strategy
- [ ] **Configure monitoring** and logging

### Application Checklist
- [ ] **Update environment variables** for production
- [ ] **Configure database** connection strings
- [ ] **Set up error handling** and logging
- [ ] **Configure CORS** for frontend-backend communication
- [ ] **Test all API endpoints** in production
- [ ] **Verify file uploads** and storage
- [ ] **Test user authentication** flow
- [ ] **Verify email** functionality (if applicable)

### Performance Checklist
- [ ] **Enable gzip compression**
- [ ] **Configure CDN** for static assets
- [ ] **Set up database indexing**
- [ ] **Configure caching** strategies
- [ ] **Test load** with multiple users
- [ ] **Monitor memory** and CPU usage
- [ ] **Set up auto-scaling** rules

---

## Security Considerations

### 1. Environment Security
```bash
# Use strong, unique passwords
POSTGRES_PASSWORD=your-super-secure-password-here
SECRET_KEY=your-jwt-secret-key-minimum-32-characters

# Enable SSL/TLS
SSL_MODE=require
```

### 2. Database Security
- **Encryption at rest**: Enable database encryption
- **Network security**: Use VPC and security groups
- **Access control**: Implement least privilege access
- **Backup encryption**: Encrypt database backups

### 3. Application Security
- **HTTPS only**: Force HTTPS redirects
- **CORS configuration**: Restrict to allowed domains
- **Rate limiting**: Implement API rate limiting
- **Input validation**: Validate all user inputs
- **SQL injection**: Use parameterized queries

### 4. Monitoring & Alerting
- **Error tracking**: Set up error monitoring (Sentry)
- **Performance monitoring**: Monitor response times
- **Security monitoring**: Track failed login attempts
- **Uptime monitoring**: Monitor service availability

---

## Monitoring & Maintenance

### 1. Health Checks
```bash
# Frontend health check
curl https://your-app.com/health

# Backend health check
curl https://your-api.com/

# Database health check
curl https://your-api.com/api/health
```

### 2. Logging
- **Application logs**: Centralized logging system
- **Error logs**: Track and alert on errors
- **Access logs**: Monitor user activity
- **Performance logs**: Track response times

### 3. Backup Strategy
- **Database backups**: Daily automated backups
- **Code backups**: Git repository with multiple remotes
- **Configuration backups**: Infrastructure as code
- **Disaster recovery**: Test restore procedures

### 4. Updates & Maintenance
- **Security updates**: Regular security patches
- **Dependency updates**: Keep dependencies current
- **Performance optimization**: Regular performance reviews
- **Capacity planning**: Monitor resource usage

---

## Cost Optimization

### 1. Right-Sizing
- **Start small**: Begin with minimal resources
- **Monitor usage**: Track actual resource consumption
- **Scale gradually**: Add resources as needed
- **Use auto-scaling**: Scale based on demand

### 2. Reserved Instances
- **Commit to usage**: Use reserved instances for predictable workloads
- **Long-term savings**: 30-50% cost reduction
- **Plan ahead**: Estimate usage for 1-3 years

### 3. Storage Optimization
- **Clean up logs**: Regular log rotation and cleanup
- **Optimize images**: Compress and optimize static assets
- **Database cleanup**: Regular database maintenance
- **CDN usage**: Use CDN for static content

### 4. Monitoring Costs
- **Set up billing alerts**: Monitor spending
- **Track usage patterns**: Understand cost drivers
- **Regular reviews**: Monthly cost optimization reviews
- **Budget planning**: Plan for growth and scaling

---

## Quick Start: DigitalOcean (Recommended)

### 1. One-Click Deployment
```bash
# 1. Push your code to GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. Go to DigitalOcean App Platform
# 3. Connect GitHub repository
# 4. Configure services (Frontend, Backend, Database)
# 5. Deploy!
```

### 2. Access Your Application
- **Frontend**: `https://your-app.ondigitalocean.app`
- **Backend API**: `https://your-backend.ondigitalocean.app`
- **Database**: Managed PostgreSQL service

### 3. Custom Domain (Optional)
```bash
# Add CNAME record
app.yourdomain.com → your-app.ondigitalocean.app
```

---

## Conclusion

### **🏆 Top Recommendations:**

#### **1. Contabo VPS - Best Value ($5-20/month)**
**Choose Contabo if:**
- You want maximum cost savings (80% cheaper than managed platforms)
- You have server administration skills
- You need high performance with dedicated resources
- You want full control over your environment
- Budget is your primary concern

#### **2. DigitalOcean App Platform - Best Balance ($27-40/month)**
**Choose DigitalOcean if:**
- You want zero DevOps management
- You need reliable uptime (99.9% SLA)
- You want easy scaling and management
- You prefer managed services
- You have moderate budget flexibility

#### **3. Railway - Simplest Deployment ($10-25/month)**
**Choose Railway if:**
- You want the absolute simplest deployment
- You don't mind some platform limitations
- You need quick setup and deployment
- You prefer managed services over VPS

#### **4. AWS ECS - Enterprise Grade ($40-80/month)**
**Choose AWS if:**
- You need enterprise-grade features
- You require global scale and compliance
- You have complex security requirements
- Budget is not a primary concern

### **Quick Decision Matrix:**

| If you want... | Choose |
|----------------|--------|
| **Cheapest option** | Contabo VPS ($5/month) |
| **Zero management** | DigitalOcean App Platform |
| **Simplest setup** | Railway |
| **Enterprise features** | AWS ECS |
| **Maximum performance** | Contabo VPS L/XL |
| **Global scale** | AWS ECS |
| **Quick deployment** | Railway or DigitalOcean |

---

*This deployment guide provides comprehensive instructions for deploying QMS Hub to production. Choose the option that best fits your needs and budget.*
