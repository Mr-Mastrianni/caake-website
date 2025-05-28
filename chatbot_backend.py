# This script sets up a FastAPI backend for a chatbot.
# It includes OpenAI API integration for generating responses and images,
# handles various HTTP requests, and uses CORS middleware for cross-origin communication.

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import json
from dotenv import load_dotenv
import logging
import asyncio
import random
import time
import socket

# --- Configuration ---
load_dotenv()  # Load environment variables from .env file
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # API key for accessing OpenAI services
if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY environment variable not set.")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Rate Limiting Configuration ---
MAX_RETRIES = 5  # Maximum number of retries for API requests
INITIAL_RETRY_DELAY = 1  # Initial delay between retries in seconds
MAX_RETRY_DELAY = 16  # Maximum delay between retries in seconds

# --- FastAPI App Initialization ---
# Initialize the FastAPI application. This 'app' instance will be used to define routes and middleware.
app = FastAPI()

# --- CORS Middleware ---
# Add CORS (Cross-Origin Resource Sharing) middleware to the application.
# This allows web pages from any origin to make requests to this FastAPI backend.
# In a production environment, it's crucial to restrict `allow_origins` to specific domains
# for security reasons.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specifies which origins are allowed to make requests. "*" means all origins.
    allow_credentials=True,  # Indicates that cookies should be supported for cross-origin requests.
    allow_methods=["*"],  # Specifies which HTTP methods are allowed (e.g., GET, POST). "*" means all methods.
    allow_headers=["*"],  # Specifies which HTTP headers can be used during the actual request. "*" means all headers.
)

SYSTEM_PROMPT = """You are CAAKE AI, the official AI assistant for CAAKE (Cost Avoidance Automation Kingz Enterprise). You are an expert in AI automation solutions and business transformation.

Core Services Knowledge:
1. AI Consulting: Expert advice on AI strategy and implementation
2. Automations: Custom solutions to streamline operations
3. AI Solutions: Tailored AI models for specific business needs
4. AI Agents: Intelligent agents for customer service and operations
5. AI Assistants: Personalized assistants for productivity
6. Chatbots: Engaging chatbots for customer interaction

Key Capabilities:
- Provide detailed information about CAAKE's services and solutions
- Help visitors understand how AI can benefit their business
- Guide users through the assessment process
- Share relevant case studies and success stories
- Generate creative visualizations using DALL-E when requested
- Schedule consultations and demos
- Answer technical and non-technical questions about AI implementation

Interaction Style:
- Professional yet approachable
- Balance technical accuracy with clear explanations
- Use concrete examples and case studies
- Proactively offer relevant information
- Guide conversations toward practical solutions
- Maintain CAAKE's brand voice as an innovative AI solutions provider

Success Stories to Reference:
1. JCM Retail Chain: 42% operational efficiency increase, $1.2M annual savings
2. Meridian Health Group: 37% reduction in administrative tasks, 29% improved patient satisfaction
3. First Capital Bank: 68% improved customer satisfaction, 74% faster query resolution

Key Features to Highlight:
- Advanced Data Analytics
- Streamlined Workflow Automation
- Digital Twin Technology
- 24/7 Availability
- Custom AI Solutions
- Integration Capabilities

Call-to-Actions:
1. Free AI Assessment: Guide qualified leads to the assessment page
2. Demo Requests: Help schedule product demonstrations
3. Consultation Booking: Assist with booking expert consultations
4. Newsletter Signup: Encourage subscription for AI insights

Response Formatting Instructions:
1. Structure your responses for clarity using sections when appropriate:
   - Use "📌 Key Points:" for main takeaways
   - Use "💡 Example:" for case studies or examples
   - Use "🔍 Details:" for in-depth explanations
   - Use "⚡ Quick Answer:" for direct, concise responses
   - Use "🎯 Next Steps:" for recommendations
   - Use "💬 Note:" for additional context or caveats

2. Format lists and numbers consistently:
   - Use bullet points (•) for related items
   - Number steps in processes (1., 2., 3.)
   - Use em dashes (—) for emphasis

3. Highlight important information:
   - Use *asterisks* for emphasis
   - Use [brackets] for metrics or statistics
   - Use "quotes" for testimonials

4. Include relevant CTAs:
   - End responses with clear next steps
   - Link to relevant pages when appropriate
   - Suggest booking consultations for complex queries

5. Keep responses concise but informative:
   - Use short paragraphs (2-3 sentences)
   - Break down complex topics into digestible chunks
   - Provide examples for abstract concepts

Remember to:
1. Always maintain context throughout the conversation
2. Offer specific, actionable solutions based on user needs
3. Use relevant case studies to demonstrate value
4. Guide users toward appropriate next steps
5. Handle technical and basic pricing questions
6. Generate engaging, on-brand images when requested

If you're unsure about specific pricing or technical details, acknowledge the question and offer to connect the user with a CAAKE specialist."""

async def make_openai_request(client, url, headers, data, timeout=30.0):
    """
    Makes an HTTP POST request to the OpenAI API with exponential backoff retry logic.

    Args:
        client (httpx.AsyncClient): An httpx.AsyncClient instance.
        url (str): The OpenAI API endpoint URL.
        headers (dict): Request headers, including authorization.
        data (dict): Request payload.
        timeout (float, optional): Request timeout in seconds. Defaults to 30.0.

    Returns:
        dict: The JSON response from the OpenAI API.

    Raises:
        HTTPException: If the request fails after multiple retries or encounters an unrecoverable error.
    """
    retry_count = 0
    retry_delay = INITIAL_RETRY_DELAY

    while retry_count < MAX_RETRIES:
        try:
            response = await client.post(
                url,
                json=data,
                headers=headers,
                timeout=timeout
            )
            
            if response.status_code == 429:  # Rate limit exceeded
                retry_count += 1
                logger.warning(f"Rate limit exceeded, attempt {retry_count} of {MAX_RETRIES}")
                
                if retry_count == MAX_RETRIES:
                    return {
                        "choices": [{
                            "message": {
                                "content": "I'm currently experiencing high demand. Please try again in a few moments."
                            }
                        }]
                    }
                
                # Add jitter to prevent thundering herd
                jitter = random.uniform(0, 0.1) * retry_delay
                await asyncio.sleep(retry_delay + jitter)
                retry_delay = min(retry_delay * 2, MAX_RETRY_DELAY)
                continue
            
            response.raise_for_status()
            return response.json()
            
        except httpx.RequestError as exc:
            logger.error(f"HTTP Request failed: {exc}")
            raise HTTPException(status_code=503, detail="Service temporarily unavailable")
        except Exception as e:
            logger.error(f"Error making OpenAI request: {e}")
            raise HTTPException(status_code=500, detail=str(e))

async def get_gpt4o_response(text: str):
    """
    Retrieves a response from OpenAI's GPT-4 model based on the input text.

    Args:
        text (str): The user's input message/query.

    Returns:
        str: The GPT-4 model's response.
             Returns a placeholder if the OpenAI API key is not set or if the input is 'ping'.
    """
    logger.info(f"Received text for GPT: {text}")
    
    if not OPENAI_API_KEY:
        logger.warning("OpenAI API key not set, using placeholder response")
        await asyncio.sleep(1)
        return "I'm currently in development mode. Please set up the OpenAI API key to enable my full capabilities."
    
    # Don't make API call for ping messages
    if text.lower().strip() == 'ping':
        return "I'm here and ready to help!"
    
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    data = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ],
        "temperature": 0.7
    }
    
    async with httpx.AsyncClient() as client:
        result = await make_openai_request(
            client,
            "https://api.openai.com/v1/chat/completions",
            headers,
            data
        )
        return result["choices"][0]["message"]["content"]

async def generate_dalle_image(prompt: str):
    """
    Generates an image using OpenAI's DALL-E model based on the input prompt.
    The prompt is first improved by GPT-4 to enhance image quality and relevance.

    Args:
        prompt (str): The user's input prompt for image generation.

    Returns:
        str: The URL of the generated image.
             Returns a placeholder image URL if the OpenAI API key is not set.

    Raises:
        HTTPException: If the image generation request fails or encounters an error.
    """
    logger.info(f"Received prompt for DALL-E: {prompt}")
    
    if not OPENAI_API_KEY:
        logger.warning("OpenAI API key not set, using placeholder image")
        await asyncio.sleep(1)
        return f"https://via.placeholder.com/512x512.png?text=API+Key+Required"
    
    # First, let's improve the prompt using GPT-4
    improved_prompt = await get_gpt4o_response(
        f"""Please convert this image request into a detailed, creative DALL-E prompt that will generate a high-quality, artistic image aligned with CAAKE's brand and services. 
        The image should be professional, innovative, and suitable for a business context.
        Original request: {prompt}"""
    )
    
    logger.info(f"Improved DALL-E prompt: {improved_prompt}")
    
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    data = {
        "model": "dall-e-3",
        "prompt": improved_prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "hd",
        "style": "vivid"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            result = await make_openai_request(
                client,
                "https://api.openai.com/v1/images/generations",
                headers,
                data,
                timeout=60.0
            )
            return result["data"][0]["url"]
        except HTTPException as e:
            raise e
        except Exception as e:
            logger.error(f"Error processing DALL-E request: {e}")
            raise HTTPException(status_code=500, detail="Internal server error processing image generation.")

# --- Routes ---
@app.get("/api/config")
async def get_config():
    """
    Endpoint to serve public API configuration securely.
    Provides the OpenAI API key and rate limiting parameters.

    Raises:
        HTTPException: If the OPENAI_API_KEY is not configured on the server.

    Returns:
        JSONResponse: A JSON object containing the API configuration.
    """
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured on server")
    return JSONResponse({
        "apiKey": OPENAI_API_KEY,
        "maxRetries": MAX_RETRIES,
        "initialRetryDelay": INITIAL_RETRY_DELAY,
        "maxRetryDelay": MAX_RETRY_DELAY
    })

@app.post("/chat")
async def http_chat(request: dict):
    """
    Handles incoming HTTP POST requests for the text chat functionality.
    It takes a user's message, gets a response from the GPT model, and returns it.

    Args:
        request (dict): A dictionary containing the user's message under the key "message".

    Returns:
        JSONResponse: A JSON response containing the bot's text response.
                      Handles 'ping' messages directly and provides error responses for issues.

    Raises:
        HTTPException: If the "message" is missing in the request or if an internal server error occurs.
    """
    user_message = request.get("message")
    if not user_message:
        raise HTTPException(status_code=400, detail="Missing 'message' in request body")

    try:
        # Handle ping messages without making API calls
        if user_message.lower().strip() == 'ping':
            return JSONResponse(content={"type": "text", "content": "I'm here and ready to help!"})
            
        bot_response = await get_gpt4o_response(user_message)
        return JSONResponse(content={"type": "text", "content": bot_response})
    except Exception as e:
        logger.error(f"Error in /chat endpoint: {str(e)}")
        # Specifically handle 429 (Too Many Requests) errors from the API
        if "429" in str(e): 
            return JSONResponse(
                status_code=429,
                content={
                    "type": "text",
                    "content": "I'm experiencing high demand right now. Please try again in a moment."
                }
            )
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/generate-image")
async def http_generate_image(request: dict):
    """
    Handles incoming HTTP POST requests for the image generation functionality.
    It takes a user's prompt, generates an image using DALL-E, and returns the image URL.

    Args:
        request (dict): A dictionary containing the user's prompt under the key "prompt".

    Returns:
        JSONResponse: A JSON response containing the URL of the generated image.
                      Provides error responses for issues.

    Raises:
        HTTPException: If the "prompt" is missing in the request or if an internal server error occurs during image generation.
    """
    prompt = request.get("prompt")
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing 'prompt' in request body")

    try:
        image_url = await generate_dalle_image(prompt)
        return JSONResponse(content={"type": "image", "content": image_url})
    except HTTPException as e: # Re-raise known HTTPExceptions to be handled by FastAPI's default error handling
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in /generate-image endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/")
async def read_root():
    """
    Root endpoint to check the status of the chatbot backend.

    Returns:
        dict: A dictionary indicating that the chatbot backend is running.
    """
    return {"status": "Chatbot backend is running"}

def find_available_port(start_port=8000, max_port=8020):
    """
    Finds an available network port within a specified range.

    Args:
        start_port (int, optional): The beginning of the port range to check. Defaults to 8000.
        max_port (int, optional): The end of the port range to check. Defaults to 8020.

    Returns:
        int: The first available port found in the range.

    Raises:
        RuntimeError: If no available port is found within the specified range.
    """
    for port in range(start_port, max_port + 1):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('0.0.0.0', port))
                return port
        except OSError:
            continue
    raise RuntimeError(f"No available ports in range {start_port}-{max_port}")

if __name__ == "__main__":
    # This block executes when the script is run directly (not imported as a module).
    # It's responsible for starting the Uvicorn ASGI server to serve the FastAPI application.

    import uvicorn  # Import the Uvicorn ASGI server

    try:
        # Find an available port to run the server on.
        # This helps avoid conflicts if the default port (e.g., 8000) is already in use.
        port = find_available_port()
        
        logger.info(f"Starting chatbot backend server on port {port}...")
        
        # Start the Uvicorn server:
        # - 'app': The FastAPI application instance to run.
        # - host="0.0.0.0": Makes the server accessible from any network interface.
        # - port=port: The port number determined by find_available_port().
        uvicorn.run(app, host="0.0.0.0", port=port)
        
    except Exception as e:
        # Log any errors that occur during server startup and exit the script.
        logger.error(f"Failed to start server: {e}")
        exit(1)  # Exit with a non-zero status code to indicate failure.
