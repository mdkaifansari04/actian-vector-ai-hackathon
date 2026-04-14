from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import CreateInstanceRequest
from app.runtime import container


class InstanceRouter:
    def __init__(self):
        self.router = APIRouter(prefix="/instances", tags=["instances"])
        self.router.add_api_route("", self.create_instance, methods=["POST"])
        self.router.add_api_route("", self.list_instances, methods=["GET"])

    async def create_instance(self, body: CreateInstanceRequest):
        return container.store.create_instance(name=body.name, description=body.description)

    async def list_instances(self):
        return container.store.list_instances()


router = InstanceRouter().router
