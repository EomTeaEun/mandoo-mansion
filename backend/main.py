from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
from typing import List, Optional

app = FastAPI(title="Mandoo Mansion Game API")

# CORS 설정 - React 프론트엔드(localhost:3000)에서의 요청을 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 (이미지 파일들)
# 상위 디렉토리의 images 폴더를 정적 파일로 서빙
images_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
app.mount("/images", StaticFiles(directory=images_path), name="images")

@app.get("/")
async def root():
    """루트 경로 - 간단한 인사 메시지 반환"""
    return {"message": "Hello from Backend!", "status": "success"}

@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy", "message": "Backend is running"}

# 인벤토리 데이터 모델
class Item(BaseModel):
    id: str
    name: str
    description: str
    type: str = "key"

class AddItemRequest(BaseModel):
    item: Item

class UseItemRequest(BaseModel):
    item_id: str

# 인벤토리 저장소 (메모리 기반)
inventory_items: List[Item] = []

# 인벤토리 API
@app.get("/inventory")
async def get_inventory():
    return {"items": inventory_items}

@app.post("/inventory/add")
async def add_item(request: AddItemRequest):
    inventory_items.append(request.item)
    return {"message": f"아이템 '{request.item.name}'이 추가되었습니다.", "items": inventory_items}

@app.post("/inventory/use")
async def use_item(request: UseItemRequest):
    for i, item in enumerate(inventory_items):
        if item.id == request.item_id:
            removed_item = inventory_items.pop(i)
            return {"message": f"아이템 '{removed_item.name}'을 사용했습니다.", "items": inventory_items}
    
    raise HTTPException(status_code=404, detail="아이템을 찾을 수 없습니다.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
