from fastapi import APIRouter, HTTPException
from typing import List

from app.models.space_object import SpaceObject, SpaceObjectCreate, SpaceObjectUpdate
from app.core.database import (
    get_all_space_objects,
    get_space_object_by_id,
    create_space_object,
    update_space_object,
    delete_space_object,
    get_objects_by_type
)

router = APIRouter(
    prefix="/space-objects",
    tags=["space-objects"]
)

@router.get("/", response_model=List[SpaceObject])
async def get_space_objects():
    """Получить все космические объекты"""
    return get_all_space_objects()

@router.get("/{object_id}", response_model=SpaceObject)
async def get_space_object(object_id: int):
    """Получить космический объект по ID"""
    obj = get_space_object_by_id(object_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Космический объект не найден")
    return obj

@router.post("/", response_model=SpaceObject)
async def create_new_space_object(space_object: SpaceObjectCreate):
    """Создать новый космический объект"""
    return create_space_object(space_object.dict())

@router.put("/{object_id}", response_model=SpaceObject)
async def update_space_object_endpoint(object_id: int, space_object: SpaceObjectUpdate):
    """Обновить космический объект"""
    updated_obj = update_space_object(object_id, space_object.dict())
    if not updated_obj:
        raise HTTPException(status_code=404, detail="Космический объект не найден")
    return updated_obj

@router.delete("/{object_id}")
async def delete_space_object_endpoint(object_id: int):
    """Удалить космический объект"""
    deleted_obj = delete_space_object(object_id)
    if not deleted_obj:
        raise HTTPException(status_code=404, detail="Космический объект не найден")
    return {"message": f"Объект {deleted_obj.name} удален"}

@router.get("/type/{object_type}", response_model=List[SpaceObject])
async def get_objects_by_type_endpoint(object_type: str):
    """Получить космические объекты по типу"""
    return get_objects_by_type(object_type)