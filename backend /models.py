"""
Pydantic models for data validation and serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ChatRequest(BaseModel):
    """Request model for chat completion"""
    message: str = Field(..., min_length=1, description="User message")
    model: str = Field(default="gpt-4o-mini", description="OpenAI model to use")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0, description="Model temperature")
    max_tokens: int = Field(default=150, ge=1, le=4000, description="Maximum tokens to generate")


class ChatResponse(BaseModel):
    """Response model for chat completion"""
    response: str = Field(..., description="Generated response")
    model_used: str = Field(..., description="Model used for generation")
    tokens_used: int = Field(..., description="Total tokens consumed")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")


class ModelInfo(BaseModel):
    """Model information"""
    id: str
    name: str
    description: Optional[str] = None
    max_tokens: Optional[int] = None


class ModelsResponse(BaseModel):
    """Response model for available models"""
    models: List[ModelInfo]


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusResponse(BaseModel):
    """API status response"""
    status: str
    openai_connected: bool
    database_connected: bool
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
