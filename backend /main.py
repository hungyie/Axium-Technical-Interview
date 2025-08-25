"""
LLM Practice Backend - FastAPI Application

A modular FastAPI backend for practicing LLM integration with OpenAI.
"""

# Load environment variables first
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes import router

# Create FastAPI app
app = FastAPI(
    title="LLM Practice API",
    description="A comprehensive FastAPI backend for LLM chat with conversation history",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "LLM Practice API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "api_prefix": "/api/v1"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    # create_tables()
    # print("✅ Database tables created successfully")
    print("🚀 LLM Practice API is ready!")
    print(f"📚 API Documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    import uvicorn
    
    # Get configuration from environment
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "main:app", # It’s like the Python path to your FastAPI app object, not a filesystem path.
        host=host,
        port=port,
        reload=debug,
        log_level="info" # controls the minimum severity level of logs that will be shown in stdout/stderr.
    )
