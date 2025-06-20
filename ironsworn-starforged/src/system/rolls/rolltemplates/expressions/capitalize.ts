export default (text: string): string =>
    text
        .split(' ')
        .map(word => `${word[0].toUpperCase()}${word.substring(1, word.length)}`)
        .join(' ')
