# Deployment Guide

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Environment Variables](#environment-variables)

## Docker Deployment

### Prerequisites
- Docker 20+
- Docker Compose 2+

### Steps

1. **Build the image**
```bash
docker build -t maxisub-api:latest .
```

2. **Run with Docker Compose**
```bash
docker-compose up -d
```

3. **Check logs**
```bash
docker-compose logs -f api
```

4. **Stop services**
```bash
docker-compose down
```

## AWS Deployment

### Using ECS (Elastic Container Service)

1. **Push to ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag maxisub-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/maxisub-api:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/maxisub-api:latest
```

2. **Create ECS cluster and task definition**
3. **Configure RDS PostgreSQL**
4. **Set up Application Load Balancer**
5. **Deploy service**

## Heroku Deployment
```bash
# Login to Heroku
heroku login

# Create app
heroku create maxisub-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set STRIPE_SECRET_KEY=your-stripe-key

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

## Environment Variables

Ensure all required environment variables are set:
```bash
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_NAME=maxisub
DB_USER=postgres
DB_PASSWORD=secure-password
JWT_SECRET=very-secure-secret
STRIPE_SECRET_KEY=sk_live_...
EMAIL_HOST=smtp.sendgrid.net
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

## SSL/TLS Configuration

Always use HTTPS in production. Configure with:
- AWS Certificate Manager (ACM)
- Let's Encrypt
- Cloudflare SSL

## Monitoring

Set up monitoring with:
- AWS CloudWatch
- Datadog
- New Relic
- Sentry (error tracking)