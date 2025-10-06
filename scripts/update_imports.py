#!/usr/bin/env python3
import os
import re

ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src")

# Match exact import starts and any in-line usages
SINGLE_QUOTE_PATTERN = re.compile(r"from '@/hooks")
DOUBLE_QUOTE_PATTERN = re.compile(r'from "@/hooks')
ANY_USAGE_PATTERN = re.compile(r"@/hooks/")

def should_process(filename: str) -> bool:
    return filename.endswith(".ts") or filename.endswith(".tsx")

def rewrite_contents(contents: str) -> str:
    updated = SINGLE_QUOTE_PATTERN.sub("from '@/lib/hooks", contents)
    updated = DOUBLE_QUOTE_PATTERN.sub('from "@/lib/hooks', updated)
    updated = ANY_USAGE_PATTERN.sub("@/lib/hooks/", updated)
    return updated

def main() -> None:
    changed_files = 0
    for dirpath, _, filenames in os.walk(ROOT):
        for name in filenames:
            if not should_process(name):
                continue
            path = os.path.join(dirpath, name)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    src = f.read()
                dst = rewrite_contents(src)
                if dst != src:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(dst)
                    changed_files += 1
            except Exception as exc:
                print(f"WARN: failed to process {path}: {exc}")
                continue
    print(f"Updated imports in {changed_files} file(s)")

if __name__ == "__main__":
    main()


