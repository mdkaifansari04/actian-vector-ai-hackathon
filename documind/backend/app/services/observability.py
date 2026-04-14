from __future__ import annotations


class ObservabilityService:
    @staticmethod
    def summarize_logs(logs: list[dict]) -> dict:
        if not logs:
            return {
                "total_queries": 0,
                "avg_retrieval_score": 0.0,
                "avg_chunk_relevance": 0.0,
                "avg_hallucination_rate": 0.0,
                "avg_response_ms": 0,
            }

        total = len(logs)
        retrieval = sum(float(log.get("retrieval_score") or 0.0) for log in logs) / total
        relevance = sum(float(log.get("chunk_relevance") or 0.0) for log in logs) / total
        hallucination = sum(float(log.get("hallucination_rate") or 0.0) for log in logs) / total
        response_ms = sum(int(log.get("response_ms") or 0) for log in logs) / total

        return {
            "total_queries": total,
            "avg_retrieval_score": round(retrieval, 3),
            "avg_chunk_relevance": round(relevance, 3),
            "avg_hallucination_rate": round(hallucination, 3),
            "avg_response_ms": int(round(response_ms)),
        }
