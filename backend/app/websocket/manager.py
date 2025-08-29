import json
import asyncio
from typing import List
from fastapi import WebSocket, WebSocketDisconnect
from app.services.tmdb_service import tmdb_service

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")
        
        # Send initial trending movies when client connects
        try:
            trending_movies = await tmdb_service.get_trending_movies()
            await websocket.send_text(json.dumps({
                "type": "trending_movies",
                "data": trending_movies
            }))
        except Exception as e:
            print(f"Error sending initial data: {e}")
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"Client disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Error sending personal message: {e}")
    
    async def broadcast(self, message: str):
        disconnected_clients = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                disconnected_clients.append(connection)
        
        # Remove disconnected clients
        for client in disconnected_clients:
            self.disconnect(client)

# Create global manager instance
manager = ConnectionManager()
