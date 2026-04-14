from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.runtime import container


class ObservabilityRouter:
    def __init__(self):
        self.router = APIRouter(prefix="/observability", tags=["observability"])
        self.router.add_api_route("/scores", self.get_scores, methods=["GET"])
        self.router.add_api_route("/alerts", self.get_alerts, methods=["GET"])

    @staticmethod
    def _parse_window(window: str) -> int:
        raw = window.strip().lower()
        if raw.endswith("h"):
            return max(1, int(raw[:-1] or "1"))
        if raw.endswith("d"):
            return max(1, int(raw[:-1] or "1")) * 24
        return 1

    async def get_scores(self, kb_id: str = Query(...), window: str = Query(default="1h")):
        kb = container.store.get_knowledge_base(kb_id)
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")

        hours = self._parse_window(window)
        logs = container.store.list_query_logs(knowledge_base_id=kb_id, window_hours=hours)
        summary = container.observability.summarize_logs(logs)
        return {"kb_id": kb_id, "window": window, **summary}

    async def get_alerts(self, kb_id: str = Query(...), window: str = Query(default="1h")):
        kb = container.store.get_knowledge_base(kb_id)
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")

        hours = self._parse_window(window)
        logs = container.store.list_query_logs(knowledge_base_id=kb_id, window_hours=hours)
        summary = container.observability.summarize_logs(logs)

        alerts = []
        if summary["avg_retrieval_score"] < 0.5 and summary["total_queries"] > 0:
            alerts.append({"type": "low_retrieval_score", "value": summary["avg_retrieval_score"]})
        if summary["avg_response_ms"] > 2500 and summary["total_queries"] > 0:
            alerts.append({"type": "high_latency", "value": summary["avg_response_ms"]})

        return {"kb_id": kb_id, "window": window, "alerts": alerts}


router = ObservabilityRouter().router
