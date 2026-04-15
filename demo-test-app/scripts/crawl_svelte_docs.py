#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import time
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen

ALLOWED_HOSTS = {"svelte.dev", "www.svelte.dev"}
ALLOWED_PREFIX = "/docs/svelte/"


def normalize_url(raw: str, base_url: str | None = None) -> str | None:
    joined = urljoin(base_url or "", raw)
    parsed = urlparse(joined)
    if parsed.scheme not in {"http", "https"}:
        return None
    if parsed.netloc not in ALLOWED_HOSTS:
        return None
    path = parsed.path or "/"
    if not path.startswith(ALLOWED_PREFIX):
        return None
    normalized_path = path.rstrip("/") or "/"
    return urlunparse(("https", "svelte.dev", normalized_path, "", "", ""))


def fetch_html(url: str, timeout_seconds: int) -> str:
    request = Request(
        url,
        headers={
            "User-Agent": "documind-svelte-crawler/1.0 (+https://svelte.dev)",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    with urlopen(request, timeout=timeout_seconds) as response:
        content = response.read()
    return content.decode("utf-8", errors="replace")


class LinkExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "a":
            return
        for key, value in attrs:
            if key == "href" and value:
                self.links.append(value)
                return


class TextExtractor(HTMLParser):
    SKIP_TAGS = {"script", "style", "noscript", "svg"}
    BLOCK_TAGS = {
        "article",
        "aside",
        "blockquote",
        "br",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "header",
        "li",
        "main",
        "nav",
        "ol",
        "p",
        "pre",
        "section",
        "table",
        "tr",
        "ul",
    }

    def __init__(self) -> None:
        super().__init__()
        self._parts: list[str] = []
        self._skip_depth = 0
        self._list_depth = 0
        self._heading_prefix: str | None = None

    def _push_break(self) -> None:
        if not self._parts:
            return
        if not self._parts[-1].endswith("\n"):
            self._parts.append("\n")

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in self.SKIP_TAGS:
            self._skip_depth += 1
            return
        if self._skip_depth > 0:
            return
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self._push_break()
            level = int(tag[1])
            self._heading_prefix = "#" * level + " "
        if tag == "li":
            self._push_break()
            self._parts.append("- ")
        if tag in {"ul", "ol"}:
            self._list_depth += 1
            self._push_break()
        if tag in self.BLOCK_TAGS:
            self._push_break()

    def handle_endtag(self, tag: str) -> None:
        if tag in self.SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1
            return
        if self._skip_depth > 0:
            return
        if tag in {"ul", "ol"} and self._list_depth > 0:
            self._list_depth -= 1
        if tag in self.BLOCK_TAGS:
            self._push_break()
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self._heading_prefix = None

    def handle_data(self, data: str) -> None:
        if self._skip_depth > 0:
            return
        text = unescape(data).strip()
        if not text:
            return
        if self._heading_prefix:
            self._parts.append(self._heading_prefix)
            self._heading_prefix = None
        self._parts.append(text)
        self._parts.append(" ")

    def as_text(self) -> str:
        text = "".join(self._parts)
        text = re.sub(r"[ \t]+\n", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"[ \t]{2,}", " ", text)
        return text.strip()


def extract_title(html: str) -> str:
    match = re.search(r"<title>(.*?)</title>", html, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return ""
    return unescape(match.group(1)).strip()


def extract_links(html: str, page_url: str) -> list[str]:
    parser = LinkExtractor()
    parser.feed(html)
    deduped: list[str] = []
    seen: set[str] = set()
    for raw in parser.links:
        normalized = normalize_url(raw, page_url)
        if normalized and normalized not in seen:
            deduped.append(normalized)
            seen.add(normalized)
    return deduped


def extract_text(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html)
    return parser.as_text()


def filename_for_url(index: int, url: str) -> str:
    path = urlparse(url).path
    rel = path[len(ALLOWED_PREFIX) :] if path.startswith(ALLOWED_PREFIX) else path.strip("/")
    rel = rel.strip("/") or "index"
    rel = rel.replace("/", "__")
    rel = re.sub(r"[^a-zA-Z0-9._-]+", "-", rel)
    return f"{index:03d}_{rel}.md"


@dataclass
class PageRecord:
    url: str
    depth: int
    title: str
    file: str
    words: int
    link_count: int


def crawl(
    *,
    seed_url: str,
    out_dir: Path,
    max_depth: int,
    max_pages: int,
    timeout_seconds: int,
    delay_seconds: float,
) -> dict:
    normalized_seed = normalize_url(seed_url)
    if not normalized_seed:
        raise ValueError(f"Seed URL is outside allowed scope: {seed_url}")

    pages_dir = out_dir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    queue: deque[tuple[str, int]] = deque([(normalized_seed, 0)])
    queued: set[str] = {normalized_seed}
    visited: set[str] = set()
    page_records: list[PageRecord] = []
    failures: list[dict[str, str]] = []

    while queue and len(page_records) < max_pages:
        url, depth = queue.popleft()
        if url in visited:
            continue
        visited.add(url)

        try:
            html = fetch_html(url, timeout_seconds=timeout_seconds)
        except Exception as exc:  # noqa: BLE001
            failures.append({"url": url, "error": str(exc)})
            continue

        title = extract_title(html)
        text = extract_text(html)
        links = extract_links(html, url)

        file_name = filename_for_url(len(page_records) + 1, url)
        file_path = pages_dir / file_name
        fetched_at = datetime.now(timezone.utc).isoformat()
        rendered_title = title or url
        payload = (
            f"# {rendered_title}\n\n"
            f"Source: {url}\n"
            f"Fetched: {fetched_at}\n\n"
            f"{text}\n"
        )
        file_path.write_text(payload, encoding="utf-8")

        page_records.append(
            PageRecord(
                url=url,
                depth=depth,
                title=rendered_title,
                file=str(file_path),
                words=len(text.split()),
                link_count=len(links),
            )
        )

        if depth < max_depth:
            for link in links:
                if link not in visited and link not in queued:
                    queue.append((link, depth + 1))
                    queued.add(link)

        if delay_seconds > 0:
            time.sleep(delay_seconds)

    manifest = {
        "seed_url": normalized_seed,
        "allowed_scope": "https://svelte.dev/docs/svelte/*",
        "max_depth": max_depth,
        "max_pages": max_pages,
        "crawled_count": len(page_records),
        "failure_count": len(failures),
        "pages": [page.__dict__ for page in page_records],
        "failures": failures,
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Crawl Svelte docs and export cleaned markdown files.")
    parser.add_argument("--seed-url", required=True)
    parser.add_argument("--out-dir", default=".documind/svelte_docs")
    parser.add_argument("--max-depth", type=int, default=2)
    parser.add_argument("--max-pages", type=int, default=60)
    parser.add_argument("--timeout-seconds", type=int, default=20)
    parser.add_argument("--delay-seconds", type=float, default=0.1)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    out_dir = Path(args.out_dir).resolve()
    manifest = crawl(
        seed_url=args.seed_url,
        out_dir=out_dir,
        max_depth=max(0, args.max_depth),
        max_pages=max(1, args.max_pages),
        timeout_seconds=max(5, args.timeout_seconds),
        delay_seconds=max(0.0, args.delay_seconds),
    )
    print(json.dumps(manifest, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
