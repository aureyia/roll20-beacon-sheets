export default (style: string, modifiers: string[]): string =>
    modifiers.map(modifier => `${style}--${modifier}`).join(' ')
