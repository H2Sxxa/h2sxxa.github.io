export function clip_text(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;

    }
    return text.slice(0, maxLength) + '...';
}

export function clip_markdown(text: string = "", maxLength: number = 100): string {
    const plain = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
        .replace(/(\*\*|~~)(.+?)\1/g, '$2')
        .replace(/(?<!\w)([*_])(?=\S)(.+?)(?<=\S)\1(?!\w)/g, '$2')
        .replace(/\s+/g, ' ')
        .trim();
    return clip_text(plain, maxLength);
}

