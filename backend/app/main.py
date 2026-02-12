"""
FastAPI main application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.storage.db import init_db

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="QRadar Rule Test Stack Editor - Clone for testing and validating security rules"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print(f"✅ {settings.APP_NAME} v{settings.APP_VERSION} started")
    print(f"📚 API Documentation: http://localhost:8000/docs")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# Import and include routers
from app.api.routes import auth, rules, building_blocks, test

app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
app.include_router(rules.router, prefix=f"{settings.API_PREFIX}/rules", tags=["rules"])
app.include_router(building_blocks.router, prefix=f"{settings.API_PREFIX}/building-blocks", tags=["building-blocks"])
app.include_router(test.router, prefix=f"{settings.API_PREFIX}/test", tags=["test"])
