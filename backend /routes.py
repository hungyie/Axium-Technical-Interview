"""
API route definitions for the LLM Practice backend.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from models import (
        ChatRequest, ChatResponse, 
        ModelsResponse, HealthResponse, StatusResponse, ErrorResponse
    )
from llm_service import LLMService

# Create router
router = APIRouter()

# Initialize LLM service
llm_service = LLMService()


@router.post("/chat", response_model=ChatResponse)
async def chat_completion(request: ChatRequest):
    """Generate a chat completion using OpenAI"""
    try:
        # Validate parameters
        validation = llm_service.validate_parameters(
            request.model, request.temperature, request.max_tokens
        )
        if not validation["valid"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid parameters: {', '.join(validation['errors'])}"
            )
        
        # Generate response using LLM service (no history context)
        response_data = llm_service.chat_completion(
            message=request.message,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            conversation_history=[]  # No history
        )
        
        return ChatResponse(
            response=response_data["response"],
            model_used=response_data["model_used"],
            tokens_used=response_data["tokens_used"],
            timestamp=response_data["timestamp"]
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@router.post("/chat/stream")
async def chat_completion_stream(request: ChatRequest):
    """Generate a streaming chat completion using OpenAI"""
    try:
        # Validate parameters
        validation = llm_service.validate_parameters(
            request.model, request.temperature, request.max_tokens
        )
        if not validation["valid"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid parameters: {', '.join(validation['errors'])}"
            )
        
        # Generate streaming response using LLM service
        def generate_stream():
            return llm_service.chat_completion_stream(
                message=request.message,
                model=request.model,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                conversation_history=[]  # No history
            )
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating streaming response: {str(e)}")


@router.get("/models", response_model=ModelsResponse)
async def get_available_models():
    """Get list of available models"""
    try:
        models = llm_service.get_available_models()
        return ModelsResponse(models=models)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching models: {str(e)}")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service="llm-practice-api"
    )


@router.get("/status", response_model=StatusResponse)
async def api_status():
    """Check API status including external dependencies"""
    try:
        # Test OpenAI connection
        openai_connected = llm_service.test_connection()
        
        # No database needed anymore
        database_connected = True
        
        # Determine overall status
        if openai_connected:
            status = "operational"
            message = "All services are running normally"
        else:
            status = "down"
            message = "OpenAI service is unavailable"
        
        return StatusResponse(
            status=status,
            openai_connected=openai_connected,
            database_connected=database_connected,
            message=message
        )
        
    except Exception as e:
        return StatusResponse(
            status="error",
            openai_connected=False,
            database_connected=False,
            message=f"Error checking status: {str(e)}"
        )
