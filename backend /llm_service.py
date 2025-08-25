"""
OpenAI LLM integration service.
"""

import openai
import os
from typing import List, Dict, Any, Optional, Iterator
from datetime import datetime
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMService:
    """Service for OpenAI LLM operations"""
    
    # Culinary Assistant Prompt Template
    CULINARY_ASSISTANT_PROMPT = """
You are a culinary assistant. 
Your behavior depends on whether the user provides ingredients:

CASE 1: If the user provides ingredients
----------------------------------------
- Return ONLY valid JSON that matches the schema below—no prose, no Markdown.
- Propose 2–3 recipes that can be made primarily from the provided ingredients.
- You may add basic pantry items if missing: water, salt, pepper, oil, sugar, flour.
- Respect any dietary preferences, allergens, excluded ingredients, cuisine, and time limit.
- Provide cookingTime in minutes (integer).
- difficulty ∈ {"Easy","Medium","Hard"}.
- nutrition is PER SERVING; round to whole numbers; include calories (kcal), protein (g), carbs (g), fat (g).
- Use the requested units (metric or US).
- Keep steps concise, imperative.
- If servings provided, scale ingredient amounts accordingly.
- No nulls/undefined, no trailing commas, no comments.

JSON Schema (must match):
{
  "type": "object",
  "properties": {
    "recipes": {
      "type": "array",
      "minItems": 2,
      "maxItems": 3,
      "items": {
        "type": "object",
        "properties": {
          "name": {"type":"string"},
          "ingredients": {"type":"array","items":{"type":"string"}},
          "instructions": {"type":"array","items":{"type":"string"}},
          "cookingTime": {"type":"integer"},
          "difficulty": {"type":"string","enum":["Easy","Medium","Hard"]},
          "nutrition": {
            "type":"object",
            "properties": {
              "calories":{"type":"integer"},
              "protein":{"type":"integer"},
              "carbs":{"type":"integer"},
              "fat":{"type":"integer"}
            },
            "required":["calories","protein","carbs","fat"]
          }
        },
        "required":["name","ingredients","instructions","cookingTime","difficulty","nutrition"]
      }
    }
  },
  "required": ["recipes"]
}

CASE 2: If the user does NOT provide ingredients
------------------------------------------------
- Ignore the JSON schema.
- Respond in normal conversational text (natural language).
- Provide helpful cooking tips, general recipe ideas, or food-related advice.
"""

    
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.default_model = "gpt-3.5-turbo"
        self.available_models = [
            {
                "id": "gpt-3.5-turbo",
                "name": "GPT-3.5 Turbo",
                "description": "Fast and efficient for most tasks",
                "max_tokens": 4096
            },
            {
                "id": "gpt-4o-mini",
                "name": "GPT-4",
                "description": "More capable but slower",
                "max_tokens": 8192
            }
        ]
    
    def chat_completion(
        self,
        message: str,
        model: str = None,
        temperature: float = 0.7,
        max_tokens: int = 150,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Generate a chat completion using OpenAI API
        
        Args:
            message: User message
            model: OpenAI model to use
            temperature: Model temperature (0.0 to 2.0)
            max_tokens: Maximum tokens to generate
            conversation_history: Previous conversation messages
            
        Returns:
            Dictionary containing response data
        """
        try:
            if not self.client.api_key:
                raise ValueError("OpenAI API key not configured")
            
            # Use default model if not specified
            if not model:
                model = self.default_model
            
            # Build messages array
            messages = []
            
            # Add system prompt first
            messages.append({
                "role": "system",
                "content": self.CULINARY_ASSISTANT_PROMPT
            })
            
            # Add conversation history if provided
            if conversation_history:
                for msg in conversation_history[-10:]:  # Limit to last 10 messages
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current user message
            messages.append({
                "role": "user",
                "content": message
            })
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            # Extract response data
            generated_text = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            
            logger.info(f"Generated response using {model}, tokens: {tokens_used}")
            
            return {
                "response": generated_text,
                "model_used": model,
                "tokens_used": tokens_used,
                "timestamp": datetime.utcnow()
            }
            
        except openai.AuthenticationError:
            logger.error("OpenAI authentication failed")
            raise ValueError("Invalid OpenAI API key")
        except openai.RateLimitError:
            logger.error("OpenAI rate limit exceeded")
            raise ValueError("Rate limit exceeded. Please try again later.")
        except openai.APIError as e:
            logger.error(f"OpenAI API error: {e}")
            raise ValueError(f"OpenAI API error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in chat completion: {e}")
            raise ValueError(f"Error generating response: {str(e)}")
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """Get list of available models"""
        return self.available_models
    
    def validate_model(self, model: str) -> bool:
        """Validate if model is available"""
        return any(m["id"] == model for m in self.available_models)
    
    def test_connection(self) -> bool:
        """Test OpenAI API connection"""
        try:
            # Make a simple API call to test connection
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=5
            )
            return True
        except Exception as e:
            logger.error(f"OpenAI connection test failed: {e}")
            return False
    
    def estimate_tokens(self, text: str) -> int:
        """
        Rough estimation of tokens in text
        (1 token ≈ 4 characters for English text)
        """
        return len(text) // 4
    
    def validate_parameters(
        self,
        model: str,
        temperature: float,
        max_tokens: int
    ) -> Dict[str, Any]:
        """
        Validate chat completion parameters
        
        Returns:
            Dictionary with validation results
        """
        errors = []
        
        # Validate model
        if not self.validate_model(model):
            errors.append(f"Invalid model: {model}")
        
        # Validate temperature
        if not 0.0 <= temperature <= 2.0:
            errors.append("Temperature must be between 0.0 and 2.0")
        
        # Validate max_tokens
        if not 1 <= max_tokens <= 4000:
            errors.append("Max tokens must be between 1 and 4000")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }
    
    def chat_completion_stream(
        self,
        message: str,
        model: str = None,
        temperature: float = 0.7,
        max_tokens: int = 150,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Iterator[str]:
        """
        Generate a streaming chat completion using OpenAI API
        
        Args:
            message: User message
            model: OpenAI model to use
            temperature: Model temperature (0.0 to 2.0)
            max_tokens: Maximum tokens to generate
            conversation_history: Previous conversation messages
            
        Yields:
            Server-Sent Events formatted strings with streaming response data
        """
        try:
            if not self.client.api_key:
                raise ValueError("OpenAI API key not configured")
            
            # Use default model if not specified
            if not model:
                model = self.default_model
            
            # Build messages array
            messages = []
            
            # Add system prompt first
            messages.append({
                "role": "system",
                "content": self.CULINARY_ASSISTANT_PROMPT
            })
            
            # Add conversation history if provided
            if conversation_history:
                for msg in conversation_history[-10:]:  # Limit to last 10 messages
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current user message
            messages.append({
                "role": "user",
                "content": message
            })
            
            # Call OpenAI API with streaming
            stream = self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )
            
            logger.info(f"Starting streaming response using {model}")
            
            # Send initial metadata
            yield f"data: {json.dumps({'type': 'start', 'model': model, 'timestamp': datetime.utcnow().isoformat()})}\n\n"
            
            full_response = ""
            
            # Stream the response
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    
                    # Send content chunk
                    yield f"data: {json.dumps({'type': 'content', 'content': content})}\n\n"
            
            # Send completion metadata
            yield f"data: {json.dumps({'type': 'end', 'full_response': full_response, 'model_used': model, 'timestamp': datetime.utcnow().isoformat()})}\n\n"
            
            logger.info(f"Completed streaming response using {model}")
            
        except openai.AuthenticationError:
            logger.error("OpenAI authentication failed")
            yield f"data: {json.dumps({'type': 'error', 'error': 'Invalid OpenAI API key'})}\n\n"
        except openai.RateLimitError:
            logger.error("OpenAI rate limit exceeded")
            yield f"data: {json.dumps({'type': 'error', 'error': 'Rate limit exceeded. Please try again later.'})}\n\n"
        except openai.APIError as e:
            logger.error(f"OpenAI API error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'error': f'OpenAI API error: {str(e)}'})}\n\n"
        except Exception as e:
            logger.error(f"Unexpected error in streaming chat completion: {e}")
            yield f"data: {json.dumps({'type': 'error', 'error': f'Error generating response: {str(e)}'})}\n\n"

    def generate_recipes(
        self,
        ingredients: List[str],
        dietary_preferences: Optional[List[str]] = None,
        allergens: Optional[List[str]] = None,
        excluded_ingredients: Optional[List[str]] = None,
        cuisine: Optional[str] = None,
        time_limit: Optional[int] = None,
        servings: Optional[int] = None,
        units: str = "metric",
        model: str = None
    ) -> Dict[str, Any]:
        """
        Generate recipe suggestions using the culinary assistant prompt
        
        Args:
            ingredients: List of available ingredients
            dietary_preferences: Optional dietary preferences (e.g., vegetarian, vegan)
            allergens: Optional list of allergens to avoid
            excluded_ingredients: Optional ingredients to exclude
            cuisine: Optional cuisine type preference
            time_limit: Optional cooking time limit in minutes
            servings: Optional number of servings
            units: Unit system to use ("metric" or "US")
            model: OpenAI model to use
            
        Returns:
            Dictionary containing recipe suggestions and metadata
        """
        try:
            # Build the user query with all parameters
            query_parts = [f"Ingredients: {', '.join(ingredients)}"]
            
            if dietary_preferences:
                query_parts.append(f"Dietary preferences: {', '.join(dietary_preferences)}")
            
            if allergens:
                query_parts.append(f"Allergens to avoid: {', '.join(allergens)}")
            
            if excluded_ingredients:
                query_parts.append(f"Excluded ingredients: {', '.join(excluded_ingredients)}")
            
            if cuisine:
                query_parts.append(f"Cuisine preference: {cuisine}")
            
            if time_limit:
                query_parts.append(f"Time limit: {time_limit} minutes")
            
            if servings:
                query_parts.append(f"Servings: {servings}")
            
            query_parts.append(f"Units: {units}")
            
            user_query = "\n".join(query_parts)
            
            # Use a higher max_tokens for recipe generation and lower temperature for consistency
            response = self.chat_completion(
                message=user_query,
                model=model or "gpt-4o-mini",  # Use more capable model for complex JSON generation
                temperature=0.3,  # Lower temperature for more consistent JSON output
                max_tokens=2000,  # Higher token limit for detailed recipes
                conversation_history=[
                    {
                        "role": "system",
                        "content": self.CULINARY_ASSISTANT_PROMPT
                    }
                ]
            )
            
            # Try to parse the JSON response
            try:
                recipes_data = json.loads(response["response"])
                
                # Validate that it has the expected structure
                if "recipes" not in recipes_data:
                    raise ValueError("Response missing 'recipes' key")
                
                if not isinstance(recipes_data["recipes"], list):
                    raise ValueError("'recipes' must be an array")
                
                if len(recipes_data["recipes"]) < 2 or len(recipes_data["recipes"]) > 3:
                    raise ValueError("Must have 2-3 recipes")
                
                # Return successful response with parsed JSON
                return {
                    "success": True,
                    "recipes": recipes_data["recipes"],
                    "model_used": response["model_used"],
                    "tokens_used": response["tokens_used"],
                    "timestamp": response["timestamp"],
                    "query_parameters": {
                        "ingredients": ingredients,
                        "dietary_preferences": dietary_preferences,
                        "allergens": allergens,
                        "excluded_ingredients": excluded_ingredients,
                        "cuisine": cuisine,
                        "time_limit": time_limit,
                        "servings": servings,
                        "units": units
                    }
                }
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON response: {e}")
                return {
                    "success": False,
                    "error": "Invalid JSON response from AI model",
                    "raw_response": response["response"],
                    "model_used": response["model_used"],
                    "tokens_used": response["tokens_used"],
                    "timestamp": response["timestamp"]
                }
            
        except Exception as e:
            logger.error(f"Error generating recipes: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow()
            }
