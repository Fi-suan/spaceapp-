from pydantic import BaseModel
from typing import Optional

class SpaceObjectBase(BaseModel):
    name: str
    type: str  # planet, star, asteroid, etc.
    description: Optional[str] = None
    distance_from_earth: Optional[float] = None  # в световых годах

class SpaceObjectCreate(SpaceObjectBase):
    pass

class SpaceObjectUpdate(SpaceObjectBase):
    pass

class SpaceObject(SpaceObjectBase):
    id: int

    class Config:
        from_attributes = True