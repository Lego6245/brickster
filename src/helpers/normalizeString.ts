export default function normalizeString(s: string): string {
    return s.normalize("NFKD").split('').filter(char => char.match(/[a-zA-Z0-9]/)).join('').toLowerCase()
}