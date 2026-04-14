from __future__ import annotations

from typing import Any

from app.config import settings


class AgentService:
    def __init__(self):
        self._openai_key = settings.openai_api_key

    @staticmethod
    def _build_context(sources: list[dict[str, Any]]) -> str:
        blocks = []
        for idx, src in enumerate(sources, start=1):
            source_ref = src.get("source_ref", "unknown")
            score = src.get("score", 0.0)
            text = src.get("text", "")
            blocks.append(f"[{idx}] Source: {source_ref} (score: {score:.3f})\n{text}")
        return "\n\n---\n\n".join(blocks)

    @staticmethod
    def _local_answer(question: str, context: str) -> str:
        if not context.strip():
            return "I don't know based on the current knowledge base."
        return (
            "Answer generated from retrieved context:\n\n"
            f"Question: {question}\n\n"
            "Key context:\n"
            f"{context[:2200]}"
        )

    def _openai_answer(self, question: str, context: str) -> str:
        import openai

        client = openai.OpenAI(api_key=self._openai_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a grounded assistant. Only answer using the provided context. "
                        "If context is insufficient, say you don't know."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Context:\n{context}\n\nQuestion: {question}",
                },
            ],
            temperature=0.2,
            max_tokens=500,
        )
        return response.choices[0].message.content or "I don't know."

    def answer(self, *, question: str, sources: list[dict[str, Any]]) -> str:
        context = self._build_context(sources)
        if not self._openai_key:
            return self._local_answer(question, context)

        try:
            return self._openai_answer(question, context)
        except Exception:
            return self._local_answer(question, context)
