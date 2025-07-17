# Deployment Guide for Moalem Plus

## Environment Configuration

### Frontend (.env.local)
For different environments, set the API URL accordingly:

```bash
# Development (localhost only)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Development (network access for mobile testing)
NEXT_PUBLIC_API_URL=http://192.168.8.8:8080

# Production
NEXT_PUBLIC_API_URL=https://api.moalem.plus
```

### Backend CORS Configuration
Update the CORS origins in `cmd/api/main.go` based on your deployment:

```go
// Development
AllowOrigins: "http://localhost:3000,http://localhost:3001,http://192.168.8.8:3001"

// Production
AllowOrigins: "https://moalem.plus,https://www.moalem.plus"
```

## Network Access (Development)

### Current Configuration:
- **Frontend**: http://192.168.8.8:3001
- **Backend**: http://192.168.8.8:8080
- **Mobile Access**: Supported ✅

### Testing from Mobile:
1. Connect your mobile device to the same WiFi network
2. Open browser and go to: `http://192.168.8.8:3001`
3. Login with: Civil ID `123456789012`, Password `password`

## Production Deployment

### Frontend (Next.js)
1. Set production API URL in environment
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your hosting provider

### Backend (Go)
1. Update CORS origins to production domains
2. Set production database URL
3. Build and deploy: `go build cmd/api/main.go`
4. Run with environment variables

### Database
- Use managed PostgreSQL service (AWS RDS, DigitalOcean, etc.)
- Set proper connection string in DATABASE_URL
- Run migrations in production environment

## Security Considerations
- Use HTTPS in production
- Set proper CORS origins (never use '*' in production)
- Use environment-specific JWT secrets
- Configure proper firewall rules
- Use managed database services with SSL
