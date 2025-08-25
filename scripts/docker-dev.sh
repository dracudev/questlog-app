#!/bin/bash

# ==============================================
# DOCKER DEVELOPMENT HELPER
# ==============================================
# Common Docker Compose operations for development
# Usage: ./scripts/docker-dev.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

COMPOSE_FILE="docker-compose.dev.yml"
COMMAND=${1:-help}

case $COMMAND in
    "up"|"start")
        echo -e "${BLUE}🚀 Starting all development services...${NC}"
        docker compose -f $COMPOSE_FILE up -d
        echo -e "${GREEN}✅ Services started successfully!${NC}"
        echo -e "${YELLOW}📋 Access your services:${NC}"
        echo -e "  🌐 Frontend: http://localhost:4321"
        echo -e "  🔌 Backend API: http://localhost:3001"
        echo -e "  🗄️  Database (Adminer): http://localhost:8080"
        echo -e "  📦 MinIO Console: http://localhost:9001"
        echo -e "  📧 MailHog: http://localhost:8025"
        echo -e "  🔄 Nginx Proxy: http://localhost"
        ;;
    "up-infra"|"infra")
        echo -e "${BLUE}🔧 Starting infrastructure services only...${NC}"
        docker compose -f $COMPOSE_FILE up -d postgres redis minio mailhog adminer
        echo -e "${GREEN}✅ Infrastructure services started!${NC}"
        ;;
    "down"|"stop")
        echo -e "${YELLOW}🛑 Stopping all services...${NC}"
        docker compose -f $COMPOSE_FILE down
        echo -e "${GREEN}✅ Services stopped${NC}"
        ;;
    "restart")
        echo -e "${YELLOW}🔄 Restarting all services...${NC}"
        docker compose -f $COMPOSE_FILE down
        docker compose -f $COMPOSE_FILE up -d
        echo -e "${GREEN}✅ Services restarted!${NC}"
        ;;
    "logs")
        SERVICE=${2:-""}
        if [ -z "$SERVICE" ]; then
            echo -e "${BLUE}📋 Showing logs for all services...${NC}"
            docker compose -f $COMPOSE_FILE logs -f
        else
            echo -e "${BLUE}📋 Showing logs for $SERVICE...${NC}"
            docker compose -f $COMPOSE_FILE logs -f $SERVICE
        fi
        ;;
    "ps"|"status")
        echo -e "${BLUE}📊 Service status:${NC}"
        docker compose -f $COMPOSE_FILE ps
        ;;
    "clean")
        echo -e "${YELLOW}🧹 Cleaning up containers and volumes...${NC}"
        docker compose -f $COMPOSE_FILE down -v --remove-orphans
        echo -e "${GREEN}✅ Cleanup complete${NC}"
        ;;
    "rebuild")
        SERVICE=${2:-""}
        if [ -z "$SERVICE" ]; then
            echo -e "${YELLOW}🔨 Rebuilding all services...${NC}"
            docker compose -f $COMPOSE_FILE down
            docker compose -f $COMPOSE_FILE build --no-cache
            docker compose -f $COMPOSE_FILE up -d
        else
            echo -e "${YELLOW}🔨 Rebuilding $SERVICE...${NC}"
            docker compose -f $COMPOSE_FILE stop $SERVICE
            docker compose -f $COMPOSE_FILE build --no-cache $SERVICE
            docker compose -f $COMPOSE_FILE up -d $SERVICE
        fi
        echo -e "${GREEN}✅ Rebuild complete!${NC}"
        ;;
    "exec")
        SERVICE=${2:-"backend"}
        SHELL=${3:-"bash"}
        echo -e "${BLUE}🔌 Connecting to $SERVICE container...${NC}"
        docker compose -f $COMPOSE_FILE exec $SERVICE $SHELL
        ;;
    "help"|*)
        echo -e "${BLUE}🎮 Questlog Docker Development Helper${NC}"
        echo -e "${BLUE}====================================${NC}"
        echo ""
        echo -e "${YELLOW}Usage:${NC} ./scripts/docker-dev.sh [command] [options]"
        echo ""
        echo -e "${YELLOW}Commands:${NC}"
        echo -e "  ${GREEN}up, start${NC}        Start all development services"
        echo -e "  ${GREEN}up-infra, infra${NC}  Start only infrastructure services (DB, Redis, MinIO)"
        echo -e "  ${GREEN}down, stop${NC}       Stop all services"
        echo -e "  ${GREEN}restart${NC}          Restart all services"
        echo -e "  ${GREEN}logs [service]${NC}   Show logs (all services or specific service)"
        echo -e "  ${GREEN}ps, status${NC}       Show service status"
        echo -e "  ${GREEN}clean${NC}            Stop services and remove volumes"
        echo -e "  ${GREEN}rebuild [service]${NC} Rebuild and restart services (all or specific)"
        echo -e "  ${GREEN}exec [service] [shell]${NC} Execute shell in service (default: backend, bash)"
        echo -e "  ${GREEN}help${NC}             Show this help message"
        echo ""
        echo -e "${YELLOW}Examples:${NC}"
        echo -e "  ./scripts/docker-dev.sh up"
        echo -e "  ./scripts/docker-dev.sh logs backend"
        echo -e "  ./scripts/docker-dev.sh exec frontend sh"
        echo -e "  ./scripts/docker-dev.sh rebuild backend"
        ;;
esac
