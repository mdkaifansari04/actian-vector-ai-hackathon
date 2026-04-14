from __future__ import annotations

import sqlite3
import threading
import uuid
from datetime import datetime, timedelta
from typing import Any

from app.config import settings


class SQLiteControlPlaneStore:
    def __init__(self, db_path: str):
        self._db_path = db_path
        self._lock = threading.Lock()
        self.initialize()

    @staticmethod
    def _now() -> str:
        return datetime.utcnow().isoformat()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def initialize(self) -> None:
        with self._lock:
            conn = self._connect()
            try:
                cur = conn.cursor()
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS instances (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        description TEXT,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    )
                    """
                )
                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS knowledge_bases (
                        id TEXT PRIMARY KEY,
                        instance_id TEXT NOT NULL,
                        name TEXT NOT NULL,
                        namespace_id TEXT NOT NULL,
                        collection_name TEXT NOT NULL UNIQUE,
                        embedding_model TEXT NOT NULL,
                        embedding_dim INTEGER NOT NULL,
                        distance_metric TEXT NOT NULL,
                        status TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        FOREIGN KEY(instance_id) REFERENCES instances(id)
                    )
                    """
                )
                cur.execute("CREATE INDEX IF NOT EXISTS idx_kb_instance ON knowledge_bases(instance_id)")
                cur.execute("CREATE INDEX IF NOT EXISTS idx_kb_namespace ON knowledge_bases(namespace_id)")

                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS resources (
                        id TEXT PRIMARY KEY,
                        knowledge_base_id TEXT NOT NULL,
                        source_type TEXT NOT NULL,
                        source_ref TEXT NOT NULL,
                        chunks_indexed INTEGER NOT NULL DEFAULT 0,
                        status TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        FOREIGN KEY(knowledge_base_id) REFERENCES knowledge_bases(id)
                    )
                    """
                )
                cur.execute("CREATE INDEX IF NOT EXISTS idx_resource_kb ON resources(knowledge_base_id)")

                cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS query_logs (
                        id TEXT PRIMARY KEY,
                        knowledge_base_id TEXT NOT NULL,
                        query TEXT NOT NULL,
                        retrieval_score REAL,
                        chunk_relevance REAL,
                        hallucination_rate REAL,
                        chunks_retrieved INTEGER NOT NULL DEFAULT 0,
                        response_ms INTEGER,
                        created_at TEXT NOT NULL,
                        FOREIGN KEY(knowledge_base_id) REFERENCES knowledge_bases(id)
                    )
                    """
                )
                cur.execute("CREATE INDEX IF NOT EXISTS idx_query_log_kb ON query_logs(knowledge_base_id)")
                cur.execute("CREATE INDEX IF NOT EXISTS idx_query_log_created ON query_logs(created_at)")
                conn.commit()
            finally:
                conn.close()

    @staticmethod
    def _row_to_dict(row: sqlite3.Row | None) -> dict[str, Any] | None:
        return dict(row) if row else None

    def create_instance(self, name: str, description: str | None = None) -> dict[str, Any]:
        instance_id = str(uuid.uuid4())
        now = self._now()
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    "INSERT INTO instances (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                    (instance_id, name, description, now, now),
                )
                conn.commit()
                row = conn.execute("SELECT * FROM instances WHERE id = ?", (instance_id,)).fetchone()
                return self._row_to_dict(row) or {}
            finally:
                conn.close()

    def list_instances(self) -> list[dict[str, Any]]:
        conn = self._connect()
        try:
            rows = conn.execute("SELECT * FROM instances ORDER BY created_at DESC").fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()

    def get_instance(self, instance_id: str) -> dict[str, Any] | None:
        conn = self._connect()
        try:
            row = conn.execute("SELECT * FROM instances WHERE id = ?", (instance_id,)).fetchone()
            return self._row_to_dict(row)
        finally:
            conn.close()

    def create_knowledge_base(
        self,
        instance_id: str,
        name: str,
        namespace_id: str,
        collection_name: str,
        embedding_model: str,
        embedding_dim: int,
        distance_metric: str,
        status: str = "active",
        kb_id: str | None = None,
    ) -> dict[str, Any]:
        kb_id = kb_id or str(uuid.uuid4())
        now = self._now()
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    INSERT INTO knowledge_bases
                    (id, instance_id, name, namespace_id, collection_name, embedding_model, embedding_dim, distance_metric, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        kb_id,
                        instance_id,
                        name,
                        namespace_id,
                        collection_name,
                        embedding_model,
                        embedding_dim,
                        distance_metric,
                        status,
                        now,
                        now,
                    ),
                )
                conn.commit()
                row = conn.execute("SELECT * FROM knowledge_bases WHERE id = ?", (kb_id,)).fetchone()
                return self._row_to_dict(row) or {}
            finally:
                conn.close()

    def get_knowledge_base(self, kb_id: str) -> dict[str, Any] | None:
        conn = self._connect()
        try:
            row = conn.execute("SELECT * FROM knowledge_bases WHERE id = ?", (kb_id,)).fetchone()
            return self._row_to_dict(row)
        finally:
            conn.close()

    def list_knowledge_bases(self, instance_id: str | None = None) -> list[dict[str, Any]]:
        conn = self._connect()
        try:
            if instance_id:
                rows = conn.execute(
                    "SELECT * FROM knowledge_bases WHERE instance_id = ? ORDER BY created_at DESC",
                    (instance_id,),
                ).fetchall()
            else:
                rows = conn.execute("SELECT * FROM knowledge_bases ORDER BY created_at DESC").fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()

    def find_kb_by_namespace(self, instance_id: str, namespace_id: str) -> dict[str, Any] | None:
        conn = self._connect()
        try:
            row = conn.execute(
                "SELECT * FROM knowledge_bases WHERE instance_id = ? AND namespace_id = ? LIMIT 1",
                (instance_id, namespace_id),
            ).fetchone()
            return self._row_to_dict(row)
        finally:
            conn.close()

    def create_resource(self, knowledge_base_id: str, source_type: str, source_ref: str, status: str = "processing") -> dict[str, Any]:
        resource_id = str(uuid.uuid4())
        now = self._now()
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    INSERT INTO resources (id, knowledge_base_id, source_type, source_ref, chunks_indexed, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, 0, ?, ?, ?)
                    """,
                    (resource_id, knowledge_base_id, source_type, source_ref, status, now, now),
                )
                conn.commit()
                row = conn.execute("SELECT * FROM resources WHERE id = ?", (resource_id,)).fetchone()
                return self._row_to_dict(row) or {}
            finally:
                conn.close()

    def update_resource(self, resource_id: str, *, status: str, chunks_indexed: int | None = None) -> None:
        now = self._now()
        with self._lock:
            conn = self._connect()
            try:
                if chunks_indexed is None:
                    conn.execute(
                        "UPDATE resources SET status = ?, updated_at = ? WHERE id = ?",
                        (status, now, resource_id),
                    )
                else:
                    conn.execute(
                        "UPDATE resources SET status = ?, chunks_indexed = ?, updated_at = ? WHERE id = ?",
                        (status, chunks_indexed, now, resource_id),
                    )
                conn.commit()
            finally:
                conn.close()

    def list_resources(self, knowledge_base_id: str) -> list[dict[str, Any]]:
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT * FROM resources WHERE knowledge_base_id = ? ORDER BY created_at DESC",
                (knowledge_base_id,),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()

    def create_query_log(
        self,
        knowledge_base_id: str,
        query: str,
        chunks_retrieved: int,
        response_ms: int,
        retrieval_score: float | None = None,
        chunk_relevance: float | None = None,
        hallucination_rate: float | None = None,
    ) -> dict[str, Any]:
        query_id = str(uuid.uuid4())
        now = self._now()
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    INSERT INTO query_logs
                    (id, knowledge_base_id, query, retrieval_score, chunk_relevance, hallucination_rate, chunks_retrieved, response_ms, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        query_id,
                        knowledge_base_id,
                        query,
                        retrieval_score,
                        chunk_relevance,
                        hallucination_rate,
                        chunks_retrieved,
                        response_ms,
                        now,
                    ),
                )
                conn.commit()
                row = conn.execute("SELECT * FROM query_logs WHERE id = ?", (query_id,)).fetchone()
                return self._row_to_dict(row) or {}
            finally:
                conn.close()

    def list_query_logs(self, knowledge_base_id: str, window_hours: int = 1) -> list[dict[str, Any]]:
        since = (datetime.utcnow() - timedelta(hours=window_hours)).isoformat()
        conn = self._connect()
        try:
            rows = conn.execute(
                "SELECT * FROM query_logs WHERE knowledge_base_id = ? AND created_at >= ? ORDER BY created_at DESC",
                (knowledge_base_id, since),
            ).fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()


def get_store() -> SQLiteControlPlaneStore:
    if settings.control_db_provider != "sqlite":
        raise RuntimeError(
            "Only sqlite control-plane is wired right now. "
            "Set CONTROL_DB_PROVIDER=sqlite or extend app/database.py for Prisma."
        )
    return SQLiteControlPlaneStore(settings.sqlite_path)
