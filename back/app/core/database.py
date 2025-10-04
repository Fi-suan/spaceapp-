from app.models.space_object import SpaceObject

# Временное хранилище данных (в реальном проекте будет база данных)
space_objects_db = [
    SpaceObject(id=1, name="Земля", type="planet", description="Наша планета", distance_from_earth=0),
    SpaceObject(id=2, name="Марс", type="planet", description="Красная планета", distance_from_earth=0.000024),
    SpaceObject(id=3, name="Солнце", type="star", description="Наша звезда", distance_from_earth=0.000016),
]

def get_all_space_objects():
    return space_objects_db

def get_space_object_by_id(object_id: int):
    for obj in space_objects_db:
        if obj.id == object_id:
            return obj
    return None

def create_space_object(space_object_data: dict):
    new_id = max([obj.id for obj in space_objects_db]) + 1 if space_objects_db else 1
    new_object = SpaceObject(id=new_id, **space_object_data)
    space_objects_db.append(new_object)
    return new_object

def update_space_object(object_id: int, space_object_data: dict):
    for i, obj in enumerate(space_objects_db):
        if obj.id == object_id:
            updated_object = SpaceObject(id=object_id, **space_object_data)
            space_objects_db[i] = updated_object
            return updated_object
    return None

def delete_space_object(object_id: int):
    for i, obj in enumerate(space_objects_db):
        if obj.id == object_id:
            return space_objects_db.pop(i)
    return None

def get_objects_by_type(object_type: str):
    return [obj for obj in space_objects_db if obj.type.lower() == object_type.lower()]