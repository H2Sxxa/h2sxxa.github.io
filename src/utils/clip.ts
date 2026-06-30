export function clip_text(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;

    }
    return text.slice(0, maxLength) + '...';
}

export function clip_markdown(text: string = "", maxLength: number = 100): string {
    const plain = text
        // strip a leading frontmatter block if one slipped through (defensive)
        .replace(/^﻿?\s*---\r?\n[\s\S]*?\r?\n---\s*/, '')
        // strip mdx ESM import/export statements
        .replace(/^[ \t]*(import|export)\b[^\n]*(\n|$)/gm, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        // strip html comments, then jsx/html tags (keep inner text of wrappers)
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<\/?[A-Za-z][^>]*>/g, '')
        .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
        .replace(/(\*\*|~~)(.+?)\1/g, '$2')
        .replace(/(?<!\w)([*_])(?=\S)(.+?)(?<=\S)\1(?!\w)/g, '$2')
        .replace(/\s+/g, ' ')
        .trim();
    return clip_text(plain, maxLength);
}

